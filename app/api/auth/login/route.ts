// app/api/auth/login/route.ts
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { identifier, password } = await request.json();

    if (!identifier || !password) {
      return NextResponse.json(
        { message: 'Email/WhatsApp dan password wajib diisi' },
        { status: 400 }
      );
    }

    // Bersihkan identifier
    const cleanIdentifier = identifier.replace(/\s+/g, '');

    // 1. Cek Admin/Staff
    const adminUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username: cleanIdentifier },
          { name: cleanIdentifier }
        ]
      }
    });

    if (adminUser) {
      const isValid = await bcrypt.compare(password, adminUser.password);
      if (!isValid) {
        return NextResponse.json(
          { message: 'Email/WhatsApp atau password salah' },
          { status: 401 }
        );
      }

      // TODO: Set session/cookie di sini
      return NextResponse.json({
        success: true,
        message: 'Login berhasil',
        user: {
          id: adminUser.id,
          name: adminUser.name,
          role: adminUser.role,
        }
      });
    }

    // 2. Cek Customer
    const customerUser = await prisma.customer.findFirst({
      where: {
        OR: [
          { whatsapp: cleanIdentifier },
          { email: cleanIdentifier }
        ]
      }
    });

    if (customerUser && customerUser.password) {
      const isValid = await bcrypt.compare(password, customerUser.password);
      if (!isValid) {
        return NextResponse.json(
          { message: 'Email/WhatsApp atau password salah' },
          { status: 401 }
        );
      }

      // TODO: Set session/cookie di sini
      return NextResponse.json({
        success: true,
        message: 'Login berhasil',
        user: {
          id: customerUser.id,
          name: customerUser.name,
          role: 'CUSTOMER',
        }
      });
    }

    return NextResponse.json(
      { message: 'Email/WhatsApp atau password salah' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan saat login' },
      { status: 500 }
    );
  }
}