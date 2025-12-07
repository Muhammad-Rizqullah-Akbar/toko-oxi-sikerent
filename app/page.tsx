import React from 'react';
import { prisma } from '@/lib/prisma';
import CatalogSection from '@/components/products/catalogSection'; // Pastikan path import benar (huruf besar/kecil)
import Header from '@/components/layout/Header';
import HeroSection from '@/components/layout/HeroSection';
import { ShoppingBag, Zap, ShieldCheck, Truck } from 'lucide-react';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function HomePage({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams;
  const activeSlug = typeof resolvedSearchParams?.category === 'string' ? resolvedSearchParams.category : 'all';

  // 1. Fetch Kategori
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
  
  // 2. Fetch Produk (Data Mentah)
  const rawProducts = await prisma.product.findMany({
    where: activeSlug !== 'all' ? { category: { slug: activeSlug } } : undefined,
    orderBy: { createdAt: 'desc' },
    include: { category: true } 
  });

  // 3. [PENTING] KONVERSI DECIMAL KE NUMBER
  // Ini solusi untuk error "Decimal objects are not supported"
  const safeProducts = rawProducts.map((product) => ({
    ...product,
    price: Number(product.price), // Ubah Decimal ke Number
    // Jika ada error tanggal, uncomment baris bawah:
    // createdAt: product.createdAt.toISOString(),
    // updatedAt: product.updatedAt.toISOString(),
  }));

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      <Header />
      <HeroSection />
      
      {/* SECTION: VALUE PROPOSITION */}
      <section className="bg-white border-b border-slate-100 py-10 relative z-20">
         <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
                { icon: Zap, title: "Proses Kilat", desc: "Sewa & Cetak Instan" },
                { icon: ShieldCheck, title: "Quality Control", desc: "Barang Terawat 100%" },
                { icon: Truck, title: "Siap Antar", desc: "Area Kampus & Kota" },
                { icon: ShoppingBag, title: "Harga Teman", desc: "Ramah di Kantong" }
            ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center text-center gap-3">
                    <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shrink-0 shadow-sm">
                        <item.icon size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800">{item.title}</h4>
                        <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                    </div>
                </div>
            ))}
         </div>
      </section>

      <main className="container mx-auto px-4 max-w-7xl pb-24 pt-12">
        {/* Kirim data yang sudah bersih (safeProducts) */}
        <CatalogSection 
            initialCategories={categories} 
            initialProducts={safeProducts} 
        />
      </main>
    </div>
  );
}