import React from 'react';
import { prisma } from '@/lib/prisma';
import CatalogSection from '@/components/products/catalogSection'; // Import komponen baru
import Header from '@/components/layout/Header';
import HeroSection from '@/components/layout/HeroSection';
import Footer from '@/components/layout/Footer';
import { ShoppingBag, Zap, ShieldCheck, Truck } from 'lucide-react';

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function HomePage({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams;
  const activeSlug = typeof resolvedSearchParams?.category === 'string' ? resolvedSearchParams.category : 'all';

  // 1. FETCH INITIAL DATA (Server Side untuk SEO Pertama kali)
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
  
  // Fetch produk awal sesuai URL (misal user share link kategori tertentu)
  const initialProducts = await prisma.product.findMany({
    where: activeSlug !== 'all' ? { category: { slug: activeSlug } } : undefined,
    orderBy: { createdAt: 'desc' },
    include: { category: true } 
  });

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
        {/* Panggil Client Component Katalog Disini */}
        <CatalogSection 
            initialCategories={categories} 
            initialProducts={initialProducts} 
        />
      </main>
      
      <Footer />
    </div>
  );
}