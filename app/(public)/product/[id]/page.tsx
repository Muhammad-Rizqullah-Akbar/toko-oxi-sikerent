import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ProductActions from '@/components/products/ProductActions'; // Import komponen langkah 1
import ProductCard from '@/components/products/ProductCard';
import { ChevronRight, Star } from 'lucide-react';
import ProductInfoTabs from '@/components/products/ProductInfoTabs'; // Import komponen baru


// Props otomatis dari Next.js untuk Dynamic Route
interface PageProps {
  params: { id: string };
}

export default async function ProductDetailPage({ params }: PageProps) {
  // Fix Next.js 15 Requirement (await params)
  const resolvedParams = await params;
  const productId = resolvedParams.id;

  // 1. AMBIL DATA PRODUK UTAMA
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { category: true } // Join kategori
  });

  // Kalau ID ngawur/tidak ketemu, lempar ke halaman 404
  if (!product) {
    notFound();
  }

  // 2. AMBIL PRODUK LAINNYA (RELATED PRODUCTS)
  // Logic: Ambil produk dari kategori yang sama, tapi bukan produk yang sedang dilihat
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: productId }
    },
    take: 4, // Ambil 4 saja
    orderBy: { createdAt: 'desc' },
    include: { category: true }
  });

  return (
    <div className="bg-white pb-20">
      
      {/* Breadcrumb Navigasi */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 py-3 text-sm text-gray-500 flex items-center gap-2">
            <Link href="/" className="hover:text-indigo-600">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href={`/?category=${product.category.slug}`} className="hover:text-indigo-600">{product.category.name}</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium truncate max-w-[200px]">{product.name}</span>
        </div>
      </div>

      <main className="container mx-auto px-4 max-w-7xl mt-8">
        
        {/* === BAGIAN ATAS: DETAIL PRODUK (GRID 2 KOLOM) === */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            
            {/* KOLOM KIRI: GALERI GAMBAR */}
            <div className="space-y-4">
                {/* Gambar Utama Besar */}
                <div className="relative aspect-square w-full bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                    <Image 
                        src={product.imageUrl || 'https://placehold.co/800x800?text=No+Image'} 
                        alt={product.name}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
                {/* Thumbnail Kecil (Sesuai Wireframe) - Dummy visual karena DB cuma support 1 gambar */}
                <div className="grid grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className={`relative aspect-square bg-gray-50 rounded-lg overflow-hidden border cursor-pointer ${i===1 ? 'border-indigo-600 ring-2 ring-indigo-100' : 'border-gray-200 hover:border-gray-300'}`}>
                             <Image 
                                src={product.imageUrl || 'https://placehold.co/150'} 
                                alt="thumb"
                                fill
                                className="object-cover opacity-80 hover:opacity-100"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* KOLOM KANAN: INFO & AKSI */}
            <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>
                
                {/* Rating Dummy (Biar mirip wireframe) */}
                <div className="flex items-center gap-2 mb-4">
                    <div className="flex text-yellow-400">
                        <Star className="w-5 h-5 fill-current" />
                        <Star className="w-5 h-5 fill-current" />
                        <Star className="w-5 h-5 fill-current" />
                        <Star className="w-5 h-5 fill-current" />
                        <Star className="w-5 h-5 text-gray-300" />
                    </div>
                    <span className="text-sm text-gray-500">(4.0 Review)</span>
                    <span className="text-gray-300">|</span>
                    <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {product.stock > 0 ? `Stok Tersedia: ${product.stock}` : 'Stok Habis'}
                    </span>
                </div>

                <div className="text-3xl font-bold text-indigo-600 mb-6 bg-indigo-50 inline-block px-4 py-2 rounded-lg">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(product.price)}
                    <span className="text-sm font-normal text-gray-500 ml-1">/ hari</span>
                </div>

               
                
                <ProductInfoTabs 
  description={product.description} 
  specifications={product.specifications} 
/>

                {/* KOMPONEN AKSI CLIENT (Tombol Sewa) */}
                <ProductActions 
                    product={{
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        imageUrl: product.imageUrl,
                        categoryName: product.category.name,
                        stock: product.stock
                    }} 
                />
            </div>
        </div>

        {/* === BAGIAN BAWAH: PRODUK LAINNYA (RELATED) === */}
        <div className="mt-20">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Produk Lainnya</h2>
                <Link href={`/?category=${product.category.slug}`} className="text-indigo-600 text-sm font-medium hover:underline">
                    Lihat Semua
                </Link>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {relatedProducts.map((relProduct) => (
                    <ProductCard
                        key={relProduct.id}
                        id={relProduct.id}
                        name={relProduct.name}
                        price={relProduct.price}
                        imageUrl={relProduct.imageUrl || 'https://placehold.co/300'}
                    />
                ))}
                
                {relatedProducts.length === 0 && (
                    <p className="text-gray-500 col-span-full py-8 text-center bg-gray-50 rounded-lg">
                        Tidak ada produk lain di kategori ini.
                    </p>
                )}
            </div>
        </div>

      </main>
    </div>
  );
}