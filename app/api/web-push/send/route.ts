// app/api/web-push/subscribe/route.ts
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  // Opsional: Pastikan yang subscribe adalah admin/staff yang login
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const subscription = await request.json();

    // Validasi payload
    if (!subscription.endpoint || !subscription.keys) {
      return NextResponse.json({ error: 'Invalid subscription' }, { status: 400 });
    }

    // Simpan ke Database (Upsert: Update jika ada, Create jika belum)
    await prisma.pushSubscription.upsert({
      where: { endpoint: subscription.endpoint },
      update: {
        keys: subscription.keys,
        userId: session.user.id, // Link ke user yang sedang login
      },
      create: {
        endpoint: subscription.endpoint,
        keys: subscription.keys,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Subscribe Error:', error);
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}