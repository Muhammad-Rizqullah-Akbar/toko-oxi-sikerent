// actions/cart.ts
"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth"; // Sesuaikan dengan config auth kamu
import { revalidatePath } from "next/cache";
import { CartItemType } from "@prisma/client";
import { LocalCartItem } from "@/types/cart";

// ==========================================
// 1. GET CART (Hanya untuk user login)
// ==========================================
export async function getCart() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const cart = await prisma.cart.findUnique({
    where: { customerId: session.user.id },
    include: {
      items: {
        include: { product: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  return cart;
}

// ==========================================
// 2. ADD TO CART (Database - Smart Merge)
// ==========================================
export async function addToCartDB(data: {
  productId: string;
  quantity: number;
  itemType: CartItemType;
  startDate?: Date;
  endDate?: Date;
  fileUrl?: string;
  notes?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // 1. Cari atau Buat Cart
  const cart = await prisma.cart.upsert({
    where: { customerId: session.user.id },
    create: { customerId: session.user.id },
    update: {},
  });

  // 2. Cek apakah Item sudah ada? (HANYA UNTUK TIPE PRODUCT BIASA)
  // Kalau RENTAL, kita selalu buat baris baru karena tanggal sewanya mungkin beda.
  // Tapi kalau PRODUCT (Jual Beli), jika beli barang sama, quantity-nya saja yang ditambah.
  
  let existingItem = null;

  if (data.itemType === CartItemType.PRODUCT) {
    existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: data.productId,
        itemType: CartItemType.PRODUCT, 
      },
    });
  }

  if (existingItem) {
    // SKENARIO A: Barang sudah ada -> Update Quantity
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: {
        quantity: existingItem.quantity + data.quantity, // Tambahkan jumlah lama + baru
        updatedAt: new Date(),
      },
    });
  } else {
    // SKENARIO B: Barang belum ada (atau ini Rental/Service) -> Buat Baru
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId: data.productId,
        quantity: data.quantity,
        itemType: data.itemType,
        startDate: data.startDate,
        endDate: data.endDate,
        fileUrl: data.fileUrl,
        notes: data.notes,
      },
    });
  }

  revalidatePath("/cart");
  return { success: true };
}

// ==========================================
// 3. UPDATE QUANTITY (Untuk Popup Edit)
// ==========================================
// Fungsi ini dipanggil saat user menekan (+) atau (-) di popup
export async function updateCartItemQuantity(productId: string, newQuantity: number) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, message: "Unauthorized" };

  // 1. Cari Cart User
  const cart = await prisma.cart.findUnique({
    where: { customerId: session.user.id },
  });

  if (!cart) return { success: false, message: "Cart not found" };

  // 2. Jika Quantity 0, HAPUS ITEM
  if (newQuantity <= 0) {
    // Hapus semua entry produk ini di cart user (Safety net)
    await prisma.cartItem.deleteMany({
      where: { 
        cartId: cart.id, 
        productId: productId 
      },
    });
  } else {
    // 3. Update Quantity
    // Kita cari item PRODUCT yang cocok. 
    // Catatan: Jika ini Rental, logic update-nya mungkin butuh ID spesifik cartItem, 
    // tapi untuk katalog view (ProductCard), kita asumsikan update item pertama yg ditemukan.
    const item = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId: productId },
    });

    if (item) {
      await prisma.cartItem.update({
        where: { id: item.id },
        data: { quantity: newQuantity },
      });
    }
  }

  revalidatePath("/cart");
  return { success: true };
}

// ==========================================
// 4. SYNC LOCAL CART TO DB (Jantung Hybrid)
// ==========================================
export async function syncLocalCartToDatabase(localItems: LocalCartItem[]) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, message: "Not logged in" };
  if (localItems.length === 0) return { success: true };

  try {
    // Kita manfaatkan fungsi addToCartDB di atas satu per satu
    // agar logic "Merge"-nya jalan (tidak duplikat barang saat sync)
    
    for (const item of localItems) {
      await addToCartDB({
        productId: item.productId,
        quantity: item.quantity,
        itemType: item.itemType,
        startDate: item.startDate ? new Date(item.startDate) : undefined,
        endDate: item.endDate ? new Date(item.endDate) : undefined,
        fileUrl: item.fileUrl,
        notes: item.notes
      });
    }

    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    console.error("Sync Error:", error);
    return { success: false, error };
  }
}