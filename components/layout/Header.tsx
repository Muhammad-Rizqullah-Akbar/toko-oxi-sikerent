// components/layout/Header.tsx

'use client'; 
import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart } from 'lucide-react'; 
// Tidak perlu import User lagi karena kita ganti jadi tombol

const Header: React.FC = () => {
  const [isSticky, setIsSticky] = useState(false);

  // Hook untuk mendengarkan event scroll (TIDAK ADA PERUBAHAN)
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 500) { 
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 w-full bg-white shadow-md transition-transform duration-300 z-50 transform 
      ${isSticky ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`} 
    >
      {/* Container utama: Gunakan 'space-x-4' dan atur elemen secara terpisah */}
      <div className="container mx-auto px-4 max-w-7xl py-3 flex items-center space-x-4">
        
        {/* 1. Nama Toko/Branding */}
        <h1 className="text-xl font-bold text-indigo-700 flex shrink-0">
            TOKO OXI
        </h1>
        
        {/* 2. Search Bar Kecil (MERAPAT KE KIRI) */}
        {/* Kita menggunakan 'flex-grow' di div search bar agar mengambil ruang kosong sebanyak mungkin */}
        <div className="flex grow max-w-lg relative"> 
            <input 
                type="text" 
                placeholder="Cari produk di TOKO OXI..." 
                className="w-full border p-2 pl-10 text-sm rounded-md bg-gray-50 focus:bg-white focus:border-indigo-500 transition-colors"
            />
            {/* Ikon Search di dalam input field */}
            <Search className="w-4 h-4  absolute left-3 top-1/2 transform -translate-y-1/2" />
        </div>
        
        {/* 3. Ikon Aksi (Keranjang) dan Tombol Sign In (MERAPAT KE KANAN) */}
        <div className="flex items-center space-x-3 shrink-0">
          
          {/* Ikon Keranjang */}
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors border border-transparent hover:border-indigo-300">
            <ShoppingCart className="w-5 h-5 text-indigo-600" />
          </button>
          
          {/* Tombol Sign In (Mengganti Ikon User) */}
          <button className="bg-indigo-600 text-white text-sm font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors shadow-md">
            Sign In
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;