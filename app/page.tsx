// app/page.tsx
// Halaman utama yang berisi Hero, Kategori, dan Katalog
'use client'; 

import React, { useState } from 'react';

// Import komponen UI/Layout
import ProductCard from '../components/layout/ProductCard'; // Perhatikan lokasi folder product
import Header from '../components/layout/Header';
import HeroSection from '../components/layout/HeroSection';
import CategoryCard from '../components/ui/CategoryCard';
import Footer from '../components/layout/Footer';

// Import ikon
import { ChevronRight, ChevronLeft } from 'lucide-react'; 

// =================================================================
// DATA MOCK (TIRUAN)
// =================================================================

// Data mock untuk Kategori Produk
const mockCategories = [
    { name: 'Semua Produk', slug: 'all' },
    { name: 'Produk A', slug: 'produk-a' },
    { name: 'Produk B', slug: 'produk-b' },
    { name: 'Produk C', slug: 'produk-c' },
    { name: 'Produk D', slug: 'produk-d' },
    { name: 'Edukasi', slug: 'edukasi' },
    { name: 'Alat Kantor', slug: 'alat-kantor' },
];

// Data mock untuk Semua Produk (dengan field categorySlug)
const allMockProducts = [
    // Produk A
    { id: 'A-1', name: 'Product A-1', price: 100000, imageUrl: '/images/product-a.jpg', categorySlug: 'produk-a' },
    { id: 'A-2', name: 'Product A-2', price: 200000, imageUrl: '/images/product-a.jpg', categorySlug: 'produk-a' },
    { id: 'A-3', name: 'Product A-3', price: 300000, imageUrl: '/images/product-a.jpg', categorySlug: 'produk-a' },
    { id: 'Z-1', name: 'Produk Lain', price: 99000, imageUrl: '/images/product-z.jpg', categorySlug: 'produk-a' },
    
    // Produk B
    { id: 'B-1', name: 'Product B-1', price: 150000, imageUrl: '/images/product-b.jpg', categorySlug: 'produk-b' },
    { id: 'B-2', name: 'Product B-2', price: 250000, imageUrl: '/images/product-b.jpg', categorySlug: 'produk-b' },
    { id: 'B-3', name: 'Product B-3', price: 350000, imageUrl: '/images/product-b.jpg', categorySlug: 'produk-b' },
    
    // Produk C
    { id: 'C-1', name: 'Product C-1', price: 50000, imageUrl: '/images/product-c.jpg', categorySlug: 'produk-c' },
    
    // Produk Edukasi & Alat Kantor
    { id: 'E-1', name: 'Buku Catatan', price: 25000, imageUrl: '/images/product-e.jpg', categorySlug: 'edukasi' },
    { id: 'E-2', name: 'Pulpen Warna', price: 15000, imageUrl: '/images/product-e.jpg', categorySlug: 'edukasi' },
    { id: 'AK-1', name: 'Stapler Besar', price: 45000, imageUrl: '/images/product-ak.jpg', categorySlug: 'alat-kantor' },
    { id: 'AK-2', name: 'Kertas HVS', price: 60000, imageUrl: '/images/product-ak.jpg', categorySlug: 'alat-kantor' },
];
// =================================================================

export default function HomePage() {
  // State untuk melacak kategori yang sedang aktif. Defaultnya 'all'.
  const [activeCategory, setActiveCategory] = useState('all');

  // 1. FILTER PRODUK: Menggunakan activeCategory untuk memfilter data mock
  const filteredProducts = activeCategory === 'all'
    ? allMockProducts
    : allMockProducts.filter(p => p.categorySlug === activeCategory);

  return (
    <>
      {/* 1. Sticky Navbar */}
      <Header /> 
      
      {/* 2. Hero Section */}
      <HeroSection /> 
      
      <main className="container mx-auto px-4 max-w-7xl">
        
        <hr className="mb-8 border-t-2 border-gray-200" /> 
        
        {/* 3. Kategori Produk A/B/C/D */}
        <section className="mb-10 pt-4">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Kategori</h2>
            
            {/* Wrapper untuk Scroll Horizontal */}
            <div className="flex items-center space-x-4 overflow-x-scroll pb-4 scrollbar-hide">
                
                {/* Tombol Panah Kiri (Opsional) */}
                <button className="flex-shrink-0 p-2 border rounded-full shadow-md bg-white hover:bg-gray-100 hidden md:block">
                    <ChevronLeft className="w-4 h-4 text-gray-600" />
                </button>

                {/* Mapping Kategori dengan filter dinamis */}
                {mockCategories.map((item) => (
                    <CategoryCard 
                        key={item.slug} 
                        name={item.name}
                        slug={item.slug}
                        isActive={activeCategory === item.slug} // Tentukan status aktif
                        onClick={setActiveCategory} // Teruskan setter state
                    />
                ))}
                
                {/* Tombol Panah Kanan (Opsional) */}
                <button className="flex-shrink-0 p-2 border rounded-full shadow-md bg-white hover:bg-gray-100 hidden md:block">
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                </button>
                
            </div>
            
        </section>

        {/* 4. Katalog Produk A */}
        <section className="mb-12">
          {/* Judul akan berubah sesuai kategori aktif */}
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Katalog {mockCategories.find(c => c.slug === activeCategory)?.name || 'Semua Produk'}
          </h2>
          
          {/* Tampilan Grid menggunakan data yang sudah DIFILTER */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                imageUrl={product.imageUrl}
              />
            ))}
            
            {/* Tampilan jika tidak ada produk */}
            {filteredProducts.length === 0 && (
                <div className="col-span-full p-10 text-center bg-gray-50 border rounded-lg text-gray-600">
                    Tidak ada produk dalam kategori ini. Silakan pilih kategori lain.
                </div>
            )}
            
          </div>
        </section>

      </main>
      
      {/* 5. Footer */}
      <Footer />
    </>
  );
}