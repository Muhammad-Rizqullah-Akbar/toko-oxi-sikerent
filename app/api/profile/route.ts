// app/api/profile/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || session.user.type !== 'customer') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const customer = await prisma.customer.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        whatsapp: true,
        email: true,
        totalPoints: true,
        isVerified: true,
        createdAt: true,
      }
    });

    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ customer });
  } catch (error) {
    console.error('Profile API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || session.user.type !== 'customer') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, email, phone } = body;

    // Validation
    if (!name?.trim()) {
      return NextResponse.json(
        { error: 'Nama tidak boleh kosong' },
        { status: 400 }
      );
    }

    if (!phone?.trim()) {
      return NextResponse.json(
        { error: 'Nomor WhatsApp tidak boleh kosong' },
        { status: 400 }
      );
    }

    // Check if WhatsApp number already exists for other customer
    const existingWhatsapp = await prisma.customer.findFirst({
      where: {
        whatsapp: phone,
        id: { not: session.user.id }
      }
    });

    if (existingWhatsapp) {
      return NextResponse.json(
        { error: 'Nomor WhatsApp sudah digunakan' },
        { status: 400 }
      );
    }

    // Check if email already exists for other customer
    if (email) {
      const existingEmail = await prisma.customer.findFirst({
        where: {
          email: email,
          id: { not: session.user.id }
        }
      });

      if (existingEmail) {
        return NextResponse.json(
          { error: 'Email sudah digunakan' },
          { status: 400 }
        );
      }
    }

    // Update customer
    const updatedCustomer = await prisma.customer.update({
      where: { id: session.user.id },
      data: {
        name: name.trim(),
        whatsapp: phone.trim(),
        email: email?.trim() || null,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        name: true,
        whatsapp: true,
        email: true,
      }
    });

    return NextResponse.json({
      message: 'Profil berhasil diperbarui',
      customer: updatedCustomer
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}