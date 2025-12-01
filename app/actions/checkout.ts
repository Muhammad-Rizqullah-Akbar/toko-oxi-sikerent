"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// [FIX] id diganti jadi string
type CheckoutItem = {
  id: string; 
  name: string;
  price: number;
  quantity: number;
  category?: string;
  fileUrl?: string;
};

type CheckoutPayload = {
  senderName: string;
  proofImage: string;
  totalAmount: number;
  items: CheckoutItem[];
  paymentMethod: string;
};

export async function processCheckout(data: CheckoutPayload) {
  try {
    // 1. Cari/Buat Customer Dummy
    let customer = await prisma.customer.findFirst();
    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name: data.senderName || "Guest User",
          whatsapp: "08123456789", 
        },
      });
    }

    // 2. Transaksi Database
    const order = await prisma.$transaction(async (tx) => {
      // Master Order
      const newOrder = await tx.order.create({
        data: {
          customerId: customer.id,
          totalAmount: data.totalAmount,
          senderName: data.senderName,
          proofImage: data.proofImage,
          status: data.proofImage === "INSTANT_PAYMENT" ? "PAID" : "PENDING",
        },
      });

      const rentalItems = data.items.filter((i) => !i.category?.toLowerCase().includes("cetak"));
      const printItems = data.items.filter((i) => i.category?.toLowerCase().includes("cetak"));

      // Rental Order
      if (rentalItems.length > 0) {
        await tx.rentalOrder.create({
          data: {
            invoiceCode: `RENT-${Date.now()}`,
            customerId: customer.id,
            orderId: newOrder.id,
            startDate: new Date(),
            dueDate: new Date(new Date().setDate(new Date().getDate() + 1)),
            totalPrice: rentalItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
            status: "PENDING",
            items: {
              create: rentalItems.map((item) => ({
                productId: item.id, // [FIX] Sudah string, tidak perlu String()
                quantity: item.quantity,
                priceAtRental: item.price,
              })),
            },
          },
        });
      }

      // Print Order
      if (printItems.length > 0) {
        for (const item of printItems) {
          await tx.printOrder.create({
            data: {
              invoiceCode: `PRT-${Date.now()}-${item.id}`, // [FIX] ID string aman di sini
              customerId: customer.id,
              orderId: newOrder.id,
              fileUrl: item.fileUrl || "pending-upload",
              serviceType: item.name,
              pageCount: item.quantity,
              totalPrice: item.price * item.quantity,
              status: "PENDING",
            },
          });
        }
      }

      return newOrder;
    });

    revalidatePath("/dashboard/orders");
    return { success: true, orderId: order.id };

  } catch (error) {
    console.error("Checkout Error:", error);
    return { success: false, error: "Gagal memproses pesanan" };
  }
}