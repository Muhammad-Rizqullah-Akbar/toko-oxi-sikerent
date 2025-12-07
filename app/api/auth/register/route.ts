// app/api/auth/register/route.ts
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { name, whatsapp, email, password } = await request.json();

    // Validasi
    if (!name || name.length < 3) {
      return NextResponse.json(
        { message: 'Nama minimal 3 karakter' },
        { status: 400 }
      );
    }

    if (!whatsapp) {
      return NextResponse.json(
        { message: 'WhatsApp wajib diisi' },
        { status: 400 }
      );
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { message: 'Password minimal 6 karakter' },
        { status: 400 }
      );
    }

    // Format WhatsApp
    let formattedWhatsapp = whatsapp.replace(/\s+/g, '');
    if (formattedWhatsapp.startsWith('0')) {
      formattedWhatsapp = '+62' + formattedWhatsapp.substring(1);
    } else if (formattedWhatsapp.startsWith('62')) {
      formattedWhatsapp = '+' + formattedWhatsapp;
    } else if (!formattedWhatsapp.startsWith('+62')) {
      formattedWhatsapp = '+62' + formattedWhatsapp;
    }

    // Cek duplikasi
    const existingCustomer = await prisma.customer.findFirst({
      where: {
        OR: [
          { whatsapp: formattedWhatsapp },
          ...(email ? [{ email }] : []),
        ],
      },
    });

    if (existingCustomer) {
      return NextResponse.json(
        { message: 'WhatsApp atau email sudah terdaftar' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat customer baru
    const customer = await prisma.customer.create({
      data: {
        name,
        whatsapp: formattedWhatsapp,
        email: email || null,
        password: hashedPassword,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Registrasi berhasil!',
      customerId: customer.id,
    });
  } catch (error) {
    console.error('Register API error:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan saat registrasi' },
      { status: 500 }
    );
  }
}