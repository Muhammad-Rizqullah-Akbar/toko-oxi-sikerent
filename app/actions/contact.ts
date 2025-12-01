'use server';

import { prisma } from '@/lib/prisma';

export async function submitContactMessage(formData: FormData) {
  // 1. Ambil data dari form
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const subject = formData.get('subject') as string;
  const message = formData.get('message') as string;

  // 2. Validasi Sederhana
  if (!name || !email || !message) {
    return { success: false, error: "Mohon lengkapi semua field wajib." };
  }

  try {
    // 3. Simpan ke Database
    await prisma.contactMessage.create({
      data: {
        name,
        email,
        subject: subject || "Tanpa Judul",
        message,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Contact Error:", error);
    return { success: false, error: "Gagal mengirim pesan. Silakan coba lagi." };
  }
}