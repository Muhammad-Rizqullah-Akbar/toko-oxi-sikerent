// middleware.ts (SIMPLE VERSION)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  });
  
  const { pathname } = request.nextUrl;

  // Kalau tidak ada token sama sekali
  if (!token) {
    // Routes yang perlu login
    const protectedRoutes = [
      '/profile', '/checkout', '/cart', '/wishlist', '/admin'
    ];
    
    const isProtected = protectedRoutes.some(route => 
      pathname.startsWith(route)
    );
    
    if (isProtected) {
      const url = new URL('/login', request.url);
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }
    
    return NextResponse.next();
  }

  // Sudah login, cek type
  const userType = token.type; // 'user' atau 'customer'
  const userRole = token.role; // 'ADMIN' atau 'STAFF' (hanya untuk user)

  // CUSTOMER-ONLY routes
  const customerOnlyRoutes = ['/profile', '/checkout', '/cart', '/wishlist'];
  const isCustomerRoute = customerOnlyRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  if (isCustomerRoute && userType !== 'customer') {
    // User (staff/admin) coba akses customer route
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  // ADMIN-ONLY routes
  const adminOnlyRoutes = ['/admin'];
  const isAdminRoute = adminOnlyRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  if (isAdminRoute && userType !== 'user') {
    // Customer coba akses admin route
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  // ADMIN role check untuk sensitive admin routes
  if (pathname.startsWith('/settings') || 
      pathname.startsWith('/users')) {
    if (userRole !== 'ADMIN') {
      // Bukan admin, redirect ke admin dashboard
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|auth/login|auth/register).*)',
  ],
};