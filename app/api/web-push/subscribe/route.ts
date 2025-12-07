import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const subscription = await request.json();
    if (!subscription.endpoint || !subscription.keys) {
      return NextResponse.json({ error: 'Invalid subscription' }, { status: 400 });
    }

    // Tentukan ini Admin atau Customer
    const isCustomer = session.user.type === 'customer'; // Pastikan session Anda punya field 'type'

    await prisma.pushSubscription.upsert({
      where: { endpoint: subscription.endpoint },
      update: {
        keys: subscription.keys,
        // Jika customer, isi customerId. Jika admin, isi userId.
        customerId: isCustomer ? session.user.id : null,
        userId: !isCustomer ? session.user.id : null,
      },
      create: {
        endpoint: subscription.endpoint,
        keys: subscription.keys,
        customerId: isCustomer ? session.user.id : null,
        userId: !isCustomer ? session.user.id : null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Subscribe Error:', error);
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}