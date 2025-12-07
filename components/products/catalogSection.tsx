'use client';

import React, { useState, useTransition } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '@/components/products/ProductCard';
import { getProductsByCategory } from '@/app/actions/getProducts';
import { Loader2, PackageOpen } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- UTILS ---
export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

// --- TYPES ---
type Category = {
  id: string;
  name: string;
  slug: string;
};

type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl: string | null;
  category: { name: string };
  stock: number;
};

interface CatalogSectionProps {
  initialCategories: Category[];
  initialProducts: Product[];
}

// --- COMPONENT ---
export default function CatalogSection({ initialCategories, initialProducts }: CatalogSectionProps) {
  const [activeSlug, setActiveSlug] = useState('all');
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isPending, startTransition] = useTransition();

  // Gabungkan tab 'Semua Produk' dengan kategori dari database
  const tabs = [
    { id: 'all', name: 'Semua Produk', slug: 'all' },
    ...initialCategories
  ];

  const handleCategoryChange = (slug: string) => {
    // 1. Update UI Tab agar responsif instan
    setActiveSlug(slug);

    // 2. Update URL Browser tanpa refresh halaman (Shallow Routing)
    window.history.pushState(null, '', slug === 'all' ? '/' : `/?category=${slug}`);

    // 3. Fetch Data Baru (Server Action) dengan Transisi
    startTransition(async () => {
      try {
        const newProducts = await getProductsByCategory(slug);
        
        // [PENTING] Mapping ulang hasil dari Server Action
        // Kita harus mengubah Decimal (dari Prisma) menjadi Number (untuk JS Client)
        const mappedProducts: Product[] = newProducts.map((p: any) => ({
          id: p.id,
          name: p.name,
          price: Number(p.price), // <--- Konversi Decimal ke Number disini
          imageUrl: p.imageUrl,
          category: { name: p.category?.name || 'Umum' },
          stock: p.stock
        }));

        setProducts(mappedProducts);
      } catch (error) {
        console.error("Gagal memuat produk:", error);
        // Opsional: Bisa tambahkan state error notification disini
      }
    });
  };

  return (
    <section id="catalog" className="scroll-mt-24"> 
      
      {/* --- HEADER SECTION --- */}
      <div className="mb-8 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-4">
         <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Katalog Pilihan</h2>
            <p className="text-slate-500 mt-2">Temukan peralatan event terbaik untuk kebutuhanmu</p>
         </div>
         
         {/* Loading Indicator */}
         {isPending && (
             <div className="flex items-center text-indigo-600 text-sm font-medium animate-pulse bg-indigo-50 px-3 py-1 rounded-full">
                 <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Memuat Produk...
             </div>
         )}
      </div>

      {/* --- TABS KATEGORI (Scrollable) --- */}
      <div className="sticky top-[70px] z-30 bg-slate-50/95 backdrop-blur-sm py-4 mb-8 -mx-4 px-4 md:static md:bg-transparent md:p-0">
        <div className="flex space-x-2 overflow-x-auto scrollbar-hide pb-2 md:pb-0 items-center">
            {tabs.map((tab) => {
                const isActive = activeSlug === tab.slug;
                return (
                    <button
                        key={tab.id}
                        onClick={() => handleCategoryChange(tab.slug)}
                        className={cn(
                            "relative px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 whitespace-nowrap outline-none focus-visible:ring-2 ring-indigo-500",
                            isActive ? "text-white" : "text-slate-600 hover:text-indigo-600 hover:bg-white"
                        )}
                        style={{ WebkitTapHighlightColor: "transparent" }}
                    >
                        {isActive && (
                            <motion.div
                                layoutId="activeCategory"
                                className="absolute inset-0 bg-slate-900 rounded-full shadow-lg shadow-indigo-200"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <span className="relative z-10">{tab.name}</span>
                    </button>
                );
            })}
        </div>
      </div>

      {/* --- LIST PRODUK --- */}
      <div className="relative min-h-[300px]">
        
        {/* Loading Overlay saat ganti kategori */}
        {isPending && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 rounded-2xl transition-all duration-300" />
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {products.map((product) => (
                <motion.div
                    key={product.id}
                    layout 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <ProductCard
                        id={product.id}
                        name={product.name}
                        price={product.price}
                        imageUrl={product.imageUrl || ''}
                        categoryName={product.category.name}
                    />
                </motion.div>
            ))}
        </div>

        {/* State Jika Kosong */}
        {!isPending && products.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-white">
                <div className="bg-slate-50 p-6 rounded-full mb-4">
                    <PackageOpen className="w-12 h-12 text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Kategori Kosong</h3>
                <p className="text-slate-500 max-w-xs mx-auto mt-2">
                    Belum ada produk untuk kategori ini. Silakan cek kategori lainnya.
                </p>
                <button 
                    onClick={() => handleCategoryChange('all')}
                    className="mt-6 text-indigo-600 font-bold hover:underline"
                >
                    Kembali ke Semua Produk
                </button>
            </div>
        )}
      </div>
    </section>
  );
}