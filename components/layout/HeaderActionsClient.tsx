// components/layout/HeaderActionsClient.tsx

'use client'; 

import { ShoppingCart, Heart } from 'lucide-react'; 
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import React from 'react';
// Import auth helpers dari wrapper Anda
import { signOut } from '@/lib/auth-client-utils'; 

interface HeaderActionsClientProps {
    isLoggedIn: boolean;
    userName: string | null | undefined;
    // Hapus handleLogout: () => void, karena kita akan menggunakan Server Action signOut di sini
}

export function HeaderActionsClient({ isLoggedIn, userName }: HeaderActionsClientProps) {
    const cartItems = useCart((state) => state.items);
    const wishlistItems = useWishlist((state) => state.items);

    // Fungsi Logout (Client Component Action)
    const handleLogout = async () => {
      // Panggil signOut (Server Action) yang diimpor
      await signOut({ redirectTo: '/auth/login' });
    };

    return (
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          
          {/* ICONS */}
          <Link href="/wishlist" className="p-2 rounded-full hover:bg-gray-100 transition-colors relative group">
            <Heart className="w-6 h-6 text-gray-600 group-hover:text-red-500 transition-colors" />
            {wishlistItems.length > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full ring-2 ring-white">
                    {wishlistItems.length}
                </span>
            )}
          </Link>

          <Link href="/cart" className="p-2 rounded-full hover:bg-gray-100 transition-colors relative group">
            <ShoppingCart className="w-6 h-6 text-gray-600 group-hover:text-indigo-600 transition-colors" />
            {cartItems.length > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full ring-2 ring-white">
                    {cartItems.length}
                </span>
            )}
          </Link>
          
          {/* LOGIN/LOGOUT STATUS */}
          {isLoggedIn ? (
                <div className="flex items-center ml-2 border-l border-slate-200 pl-3">
                    <Link href="/profile" className="text-sm font-bold text-slate-700 hover:text-indigo-600 mr-3">
                        Hi, {userName?.split(' ')[0] || 'Customer'}
                    </Link>
                    {/* Logout dipanggil langsung di Client Component */}
                    <button onClick={handleLogout} className="bg-red-500 text-white text-sm font-bold py-2 px-4 rounded-full hover:bg-red-600 transition-all">
                        Keluar
                    </button>
                </div>
            ) : (
                <Link href="/auth/login" className="bg-indigo-600 text-white text-sm font-bold py-2 px-5 rounded-full hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200 hover:shadow-lg ml-2">
                    Masuk
                </Link>
            )}
        </div>
    );
}