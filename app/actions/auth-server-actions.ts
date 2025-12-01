// app/actions/auth.ts

'use server';

import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { signIn, signOut } from '../../auth';

// --- 1. FUNGSI PENDAFTARAN (REGISTER) ---
export async function registerCustomer(formData: FormData) {
  const name = formData.get('name') as string;
  const whatsapp = formData.get('whatsapp') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirm-password') as string;

  // 1. Validasi
  if (!name || !whatsapp || !password || !confirmPassword) {
    return { success: false, message: 'Semua field wajib diisi (kecuali Email).' };
  }
  if (password.length < 8) {
      return { success: false, message: 'Password minimal 8 karakter.' };
  }
  if (password !== confirmPassword) {
    return { success: false, message: 'Konfirmasi password tidak cocok.' };
  }

  try {
    // 2. Cek duplikasi
    const existingCustomer = await prisma.customer.findUnique({
      where: { whatsapp: whatsapp },
    });

    if (existingCustomer) {
      return { success: false, message: 'Nomor WhatsApp sudah terdaftar.' };
    }

    // 3. Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Buat Customer Baru
    const newCustomer = await prisma.customer.create({
      data: {
        name: name,
        whatsapp: whatsapp, 
        email: email || undefined, 
        password: hashedPassword,
      },
    });
    
    // Auto-login setelah register
    // NextAuth akan melempar error di sini jika login gagal, tapi kita tangani di frontend.
    await signIn('credentials', { whatsapp, password, redirect: false });

    return { success: true, customerId: newCustomer.id };
  } catch (error) {
    console.error('Registration Error:', error);
    // Kita biarkan throw error agar Next.js bisa menangani redirect/error code
    throw new Error('Gagal mendaftar atau auto-login.'); 
  }
}


// --- 2. FUNGSI LOGIN ---
export async function loginCustomer(formData: FormData) {
    const identifier = formData.get('identifier') as string; 
    const password = formData.get('password') as string;

    try {
        await signIn('credentials', {
            whatsapp: identifier, 
            password: password,
            redirectTo: '/', 
        });
    } catch (error) {
        if (error instanceof Error && error.message.includes('CredentialsSignin')) {
            // Karena Next.js akan melempar error saat redirect, kita throw objek error khusus
            // untuk memberi tahu frontend status error tanpa memicu crash server.
            throw new Error('WHATSAPP_OR_PASSWORD_INVALID'); 
        }
        throw error;
    }
}

// --- 3. FUNGSI LOGOUT ---
export async function logoutCustomer() {
    'use server';
    // [FIX UTAMA]: Gunakan path absolut untuk routing yang aman di App Router
    await signOut({ redirectTo: '/login' }); 
}