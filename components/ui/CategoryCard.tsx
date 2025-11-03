// components/ui/CategoryCard.tsx

import React from 'react';
import Link from 'next/link';

interface CategoryCardProps {
  name: string;
  slug: string; // Menggunakan slug untuk identifikasi
  isActive: boolean; // Prop baru untuk status aktif
  onClick: (slug: string) => void; // Prop baru untuk handle klik
}

// Kita tidak lagi menggunakan Link, karena kita hanya memfilter di halaman yang sama
const CategoryCard: React.FC<CategoryCardProps> = ({ name, slug, isActive, onClick }) => {
  return (
    // Tambahkan onClick handler dan styling aktif di sini
    <div 
      onClick={() => onClick(slug)}
      className={`
        flex-shrink-0 w-32 h-36 bg-white border rounded-xl shadow-md p-2 text-center flex flex-col justify-end 
        transition-all duration-200 cursor-pointer group
        ${isActive 
            ? 'shadow-lg border-indigo-500 ring-2 ring-indigo-500' // Styling aktif
            : 'border-gray-200 hover:shadow-lg hover:border-indigo-300' // Styling normal
        }
      `}
    >
      
      {/* Placeholder Gambar Kategori */}
      <div className="w-full h-2/3 bg-gray-100 rounded-md mx-auto mb-2 group-hover:bg-gray-200 transition-colors"></div>
      
      {/* Nama Kategori */}
      <span className="text-sm font-medium text-gray-800">{name}</span>
      
      {/* Garis Indikator Bawah (HANYA MUNCUL KETIKA AKTIF) */}
      <div className={`h-1 rounded-full mt-1 ${isActive ? 'bg-indigo-500' : 'bg-transparent'}`}></div>
    </div>
  );
};

export default CategoryCard;