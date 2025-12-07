// app/api/auth/forgot-password/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { identifier } = await request.json();

    if (!identifier) {
      return NextResponse.json(
        { message: 'Email/WhatsApp wajib diisi' },
        { status: 400 }
      );
    }

    // Cek di database
    const customer = await prisma.customer.findFirst({
      where: {
        OR: [
          { whatsapp: identifier },
          { email: identifier },
        ],
      },
    });

    if (!customer) {
      return NextResponse.json(
        { message: 'Email/WhatsApp tidak ditemukan' },
        { status: 404 }
      );
    }

    // TODO: Implementasi reset password (kirim email/SMS)
    // Untuk sekarang, hanya return sukses
    return NextResponse.json({
      success: true,
      message: 'Instruksi reset password telah dikirim',
    });
  } catch (error) {
    console.error('Forgot password API error:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan' },
      { status: 500 }
    );
  }
}