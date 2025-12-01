// components/layout/Header.tsx

'use client'; 
import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, Heart } from 'lucide-react'; 
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import Link from 'next/link';

const Header: React.FC = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const cartItems = useCart((state) => state.items);
  const wishlistItems = useWishlist((state) => state.items);

  // Hydration fix & Scroll Listener
  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!mounted) return null;

  return (
    <header 
      className={`fixed top-0 left-0 w-full bg-white transition-all duration-300 z-50 
      ${isSticky ? 'shadow-md py-2' : 'py-4'}`} 
    >
      {/* Container utama: Sekarang memiliki Navigasi di tengah */}
      <div className="container mx-auto px-4 max-w-7xl flex items-center gap-4">
        
        {/* 1. Logo (Shrink-0) */}
        <Link href="/" className="text-2xl font-extrabold text-indigo-700 shrink-0 tracking-tight">
            TOKO OXI
        </Link>
        
        {/* 2. PRIMARY NAVIGATION (MENGISI CELAH KOSONG) */}
        <nav className="hidden lg:flex items-center gap-7 ml-8 text-sm">
            <Link href="/#catalog" className="font-bold text-slate-800 hover:text-indigo-600 transition-colors">Katalog Produk</Link>
            <Link href="/contact" className="text-slate-600 hover:text-indigo-600 transition-colors">Kontak Kami</Link>
            
        </nav>
        
        {/* 3. Search Bar (Ditarik ke kanan dengan ml-auto, max-w diperkecil) */}
        <div className="ml-auto flex grow max-w-xs relative hidden sm:block mr-4"> 
            <input 
                type="text" 
                placeholder="Cari produk..." 
                className="w-full border border-gray-200 p-2 pl-10 text-sm rounded-full bg-gray-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        </div>
        
        {/* 4. Aksi Kanan (Next to Search) */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          
          {/* Ikon Wishlist */}
          <Link href="/wishlist" className="p-2 rounded-full hover:bg-gray-100 transition-colors relative group">
            <Heart className="w-6 h-6 text-gray-600 group-hover:text-red-500 transition-colors" />
            {wishlistItems.length > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full ring-2 ring-white">
                    {wishlistItems.length}
                </span>
            )}
          </Link>

          {/* Ikon Keranjang */}
          <Link href="/cart" className="p-2 rounded-full hover:bg-gray-100 transition-colors relative group">
            <ShoppingCart className="w-6 h-6 text-gray-600 group-hover:text-indigo-600 transition-colors" />
            {cartItems.length > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full ring-2 ring-white">
                    {cartItems.length}
                </span>
            )}
          </Link>
          
          {/* Tombol Sign In */}
          <button className="bg-indigo-600 text-white text-sm font-bold py-2 px-5 rounded-full hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200 hover:shadow-lg ml-2">
            Masuk
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;