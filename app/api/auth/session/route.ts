// app/api/auth/session/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ 
        authenticated: false,
        message: 'No active session' 
      });
    }

    const userId = session.user.id;
    const userType = session.user.type; // 'user' atau 'customer'

    if (userType === 'user') {
      // Staff/Admin
      const user = await prisma.user.findUnique({
        where: { 
          id: userId,
          isActive: true 
        },
        select: {
          id: true,
          username: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          lastLogin: true,
        }
      });

      if (user) {
        return NextResponse.json({
          authenticated: true,
          user,
          type: 'user'
        });
      }
    } else if (userType === 'customer') {
      // Customer - TIDAK ADA ROLE
      const customer = await prisma.customer.findUnique({
        where: { 
          id: userId,
          isActive: true 
        },
        select: {
          id: true,
          name: true,
          whatsapp: true,
          email: true,
          totalPoints: true,
          isVerified: true,
          lastLogin: true,
          createdAt: true,
        }
      });

      if (customer) {
        return NextResponse.json({
          authenticated: true,
          customer,
          type: 'customer' // Pastikan type di-set
        });
      }
    }

    return NextResponse.json({ 
      authenticated: false,
      message: 'User not found' 
    });

  } catch (error) {
    console.error('Session API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}