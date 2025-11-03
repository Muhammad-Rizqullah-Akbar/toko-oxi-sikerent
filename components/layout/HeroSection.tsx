// components/layout/HeroSection.tsx

import React from 'react';
import { Search, ChevronDown } from 'lucide-react'; // Import ikon ChevronDown untuk dropdown

const mockCategories = ['Semua Kategori', 'Konveksi', 'Percetakan', 'Digital'];

const HeroSection: React.FC = () => {
  return (
    // Padding atas dan bawah untuk memberikan ruang yang cukup
    <div className="bg-white pt-16 pb-12"> 
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Bagian Atas: Logo Besar dan Branding (TIDAK BERUBAH) */}
        <div className="flex items-start space-x-8">
          
          {/* Kotak Logo/Gambar Besar */}
          <div className="w-48 h-48 bg-gray-200 border border-gray-300 rounded-lg shadow-xl flex-shrink-0">
            {/* Placeholder Gambar/Logo Utama */}
          </div>
          
          {/* Teks dan Info Branding */}
          <div className="pt-4">
            <h1 className="text-5xl font-extrabold text-gray-900">
              TOKO OXI
            </h1>
            <p className="text-lg text-gray-500 mt-1">
              Percetakan dan Konveksi
            </p>
            
            {/* Tombol/Placeholder Kecil di bawah deskripsi */}
            <div className="mt-4 w-28 h-7 bg-gray-300 rounded-full"></div>
          </div>
        </div>
        
        {/* Bagian Bawah Hero: Search Bar, Dropdown, dan Tombol Aksi */}
        <div className="mt-12 p-4 bg-gray-100 rounded-lg shadow-inner flex items-center justify-between">
            
            {/* Label TOKO OXI (KIRI) */}
            <span className="font-bold text-lg text-gray-700 flex-shrink-0 mr-4">
                TOKO OXI
            </span>
            
            {/* Container untuk Search, Dropdown, dan Sign In (KANAN) */}
            <div className="flex items-center space-x-3 flex-grow justify-end">
                
                {/* Search Bar */}
                {/* Kita biarkan Search Bar mengambil ruang kosong sebelum Dropdown/Sign In */}
                <div className="relative flex items-center bg-white border border-gray-300 rounded-full p-2 w-full max-w-lg">
                    <Search className="w-5 h-5 text-gray-500 ml-2 flex-shrink-0" />
                    <input 
                        type="text" 
                        placeholder="Cari katalog dan produk..." 
                        className="flex-grow bg-transparent focus:outline-none ml-2 text-sm text-gray-700"
                    />
                </div>
                
                {/* 1. Dropdown Kategori */}
                <button className="flex items-center space-x-1 bg-white border border-gray-300 text-gray-700 text-sm font-medium py-2 px-3 rounded-full hover:bg-gray-50 transition-colors flex-shrink-0">
                    <span>Kategori</span>
                    <ChevronDown className="w-4 h-4" />
                </button>

                {/* 2. Tombol Sign In (Mengganti Placeholder) */}
                <button className="bg-indigo-600 text-white text-sm font-semibold py-2 px-4 rounded-full hover:bg-indigo-700 transition-colors shadow-md flex-shrink-0">
                    Sign In
                </button>
            </div>

        </div>

      </div>
    </div>
  );
};

export default HeroSection;