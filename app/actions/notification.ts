'use server';

import { prisma } from '@/lib/prisma';
import webPush from 'web-push';

// Config Web Push
webPush.setVapidDetails(
  process.env.VAPID_SUBJECT || 'mailto:admin@example.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function sendCustomerNotification(customerId: string, templateType: 'REMINDER' | 'THANK_YOU', customData?: any) {
  try {
    // 1. Cari Subscription milik Customer ini
    const subs = await prisma.pushSubscription.findMany({
      where: { customerId: customerId }
    });

    if (subs.length === 0) return { success: false, error: "Customer belum mengaktifkan notifikasi" };

    // 2. Siapkan Pesan Berdasarkan Template
    let payload = {};

    if (templateType === 'REMINDER') {
      payload = {
        title: "⚠️ Pengingat Sewa",
        message: `Halo ${customData.name}, sewa barang Anda jatuh tempo besok (${customData.date}). Mohon dikembalikan tepat waktu ya!`,
        url: '/profile/orders'
      };
    } else if (templateType === 'THANK_YOU') {
      payload = {
        title: "🎉 Transaksi Selesai",
        message: `Terima kasih ${customData.name}! Semoga alatnya bermanfaat. Ditunggu sewa selanjutnya!`,
        url: '/products'
      };
    }

    // 3. Kirim ke semua device customer
    const promises = subs.map(sub => 
      webPush.sendNotification(
        { endpoint: sub.endpoint, keys: sub.keys as any },
        JSON.stringify(payload)
      ).catch(e => {
        if (e.statusCode === 410) prisma.pushSubscription.delete({ where: { id: sub.id }});
      })
    );

    await Promise.all(promises);
    return { success: true };

  } catch (error) {
    console.error(error);
    return { success: false, error: "Gagal mengirim notifikasi" };
  }
}

// Helper untuk mengambil data monitoring
export async function getMonitoringData() {
  // Ambil yang sedang DISEWA
  const activeRentals = await prisma.rentalOrder.findMany({
    where: { status: 'DISEWA' },
    include: { customer: true, items: { include: { product: true } } },
    orderBy: { dueDate: 'asc' } // Yang paling dekat deadline di atas
  });

  // Ambil yang baru SELESAI (untuk ucapan terima kasih)
  const completedRentals = await prisma.rentalOrder.findMany({
    where: { status: 'SELESAI' },
    take: 5,
    orderBy: { updatedAt: 'desc' },
    include: { customer: true }
  });

  return { activeRentals, completedRentals };
}