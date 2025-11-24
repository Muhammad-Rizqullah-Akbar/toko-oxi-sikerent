import React from 'react';
import { prisma } from '@/lib/prisma';
import ProductCard from '@/components/products/ProductCard';
import CategoryCard from '@/components/ui/CategoryCard';
import Header from '@/components/layout/Header';
import HeroSection from '@/components/layout/HeroSection';
import Footer from '@/components/layout/Footer';
import { ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react'; // Tambahan ikon

// Tipe Props untuk Halaman (Next.js App Router)
type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

// Pastikan function ini async karena kita panggil database
export default async function HomePage({ searchParams }: Props) {
  
  // 1. Tangkap parameter 'category' dari URL
  const resolvedSearchParams = await searchParams; // Fix untuk Next.js terbaru
  const activeSlug = typeof resolvedSearchParams?.category === 'string' ? resolvedSearchParams.category : 'all';

  // 2. FETCH KATEGORI (Untuk Navigasi Atas)
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  });

  // 3. FETCH PRODUK (Dengan Filter Dinamis)
  const products = await prisma.product.findMany({
    where: activeSlug !== 'all' ? {
      category: {
        slug: activeSlug
      }
    } : undefined,
    orderBy: { createdAt: 'desc' },
    include: { category: true } // JOIN tabel kategori wajib ada
  });

  return (
    <>
      <Header />
      <HeroSection />
      
      <main className="container mx-auto px-4 max-w-7xl pb-20">
        
        {/* BAGIAN KATEGORI */}
        <section className="mt-8 mb-10">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Kategori</h2>
                <span className="text-sm text-gray-500">Geser untuk lihat &rarr;</span>
            </div>
            
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x items-center">
                {/* Tombol 'Semua Produk' Manual */}
                <CategoryCard 
                    name="Semua Produk" 
                    slug="all" 
                    isActive={activeSlug === 'all'} 
                    // Error 1 Hilang: Tidak ada prop onClick lagi di sini
                />

                {/* Looping Kategori dari Database */}
                {categories.map((cat) => (
                    <CategoryCard 
                        key={cat.id} 
                        name={cat.name} 
                        slug={cat.slug} 
                        isActive={activeSlug === cat.slug} 
                    />
                ))}
            </div>
        </section>

        <hr className="border-gray-100 mb-10" />

        {/* BAGIAN KATALOG PRODUK */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {activeSlug === 'all' ? 'Semua Katalog' : `Katalog ${categories.find(c => c.slug === activeSlug)?.name || activeSlug}`}
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                imageUrl={product.imageUrl ?? ''}
              />
            ))}
            
            {/* Tampilan jika kosong */}
            {products.length === 0 && (
                <div className="col-span-full py-16 text-center border-2 border-dashed border-gray-200 rounded-xl">
                    <div className="inline-block p-4 rounded-full bg-gray-50 mb-3">
                        <ShoppingCart className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">Belum ada produk di kategori ini.</p>
                    <p className="text-sm text-gray-400">Coba pilih kategori lain atau cek Admin Dashboard.</p>
                </div>
            )}
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}