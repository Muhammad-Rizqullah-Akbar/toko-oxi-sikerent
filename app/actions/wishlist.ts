// actions/wishlist.ts
"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function toggleWishlist(productId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Harap login terlebih dahulu");

  const customerId = session.user.id;

  // Cek apakah sudah ada
  const existing = await prisma.wishlist.findUnique({
    where: {
      customerId_productId: {
        customerId,
        productId,
      },
    },
  });

  if (existing) {
    // Kalau ada, Hapus (Unlike)
    await prisma.wishlist.delete({
      where: { id: existing.id },
    });
    revalidatePath(`/products`); // Revalidate halaman produk
    return { isWishlisted: false };
  } else {
    // Kalau belum, Tambah (Like)
    await prisma.wishlist.create({
      data: {
        customerId,
        productId,
      },
    });
    revalidatePath(`/products`);
    return { isWishlisted: true };
  }
}