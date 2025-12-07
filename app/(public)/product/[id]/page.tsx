import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ProductActions from '@/components/products/ProductActions';
import ProductCard from '@/components/products/ProductCard';
import ProductInfoTabs from '@/components/products/ProductInfoTabs'; 
import Header from '@/components/layout/Header';
import { ChevronRight, Star, ShieldCheck, Zap, Package } from 'lucide-react';

// --- 1. KONFIGURASI GAMBAR DEMO (Sama seperti di ProductCard) ---
const DEMO_IMAGES = {
  kamera: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  cetak: "https://images.unsplash.com/photo-1589561084771-04cf8b066063?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  papan: "https://images.unsplash.com/photo-1527518084957-4f722457c604?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  drone: "https://images.unsplash.com/photo-1574315042633-89d04f66a6a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  audio: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  projector: "https://images.unsplash.com/photo-1623631915362-0c0303305135?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  default: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
};

// Helper untuk memilih gambar berdasarkan nama
const getDisplayImage = (imageUrl: string | null, productName: string) => {
  if (imageUrl) return imageUrl; // Prioritaskan gambar dari DB

  const lowerName = productName.toLowerCase();
  if (lowerName.includes('kamera') || lowerName.includes('cam')) return DEMO_IMAGES.kamera;
  if (lowerName.includes('cetak') || lowerName.includes('spanduk') || lowerName.includes('banner')) return DEMO_IMAGES.cetak;
  if (lowerName.includes('papan') || lowerName.includes('nama')) return DEMO_IMAGES.papan;
  if (lowerName.includes('drone')) return DEMO_IMAGES.drone;
  if (lowerName.includes('sound') || lowerName.includes('mic') || lowerName.includes('speaker')) return DEMO_IMAGES.audio;
  if (lowerName.includes('proyektor')) return DEMO_IMAGES.projector;
  
  return DEMO_IMAGES.default;
};

interface PageProps {
  params: Promise<{ id: string }>; // Update Next.js 15: params adalah Promise
}

export default async function ProductDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const productId = resolvedParams.id;

  // 2. AMBIL DATA PRODUK
  const productRaw = await prisma.product.findUnique({
    where: { id: productId },
    include: { category: true }
  });

  if (!productRaw) {
    notFound();
  }

  // 3. KONVERSI DECIMAL KE NUMBER & SETUP GAMBAR
  // Ini penting agar tidak error saat dikirim ke Client Component (ProductActions)
  const product = {
    ...productRaw,
    price: Number(productRaw.price),
  };

  const displayImage = getDisplayImage(product.imageUrl, product.name);

  // 4. RELATED PRODUCTS
  const relatedProductsRaw = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: productId }
    },
    take: 4,
    orderBy: { createdAt: 'desc' },
    include: { category: true }
  });

  // Konversi related products juga
  const relatedProducts = relatedProductsRaw.map(p => ({
    ...p,
    price: Number(p.price)
  }));

  const isPrinting = product.category.name.toLowerCase().includes('cetak');
  const badgeColor = isPrinting ? 'bg-orange-100 text-orange-700 border-orange-200' : 'bg-blue-100 text-blue-700 border-blue-200';

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      <Header />
      
      {/* Breadcrumb Navigasi */}
      <div className="container mx-auto px-4 max-w-7xl pt-24 pb-4">
        <div className="flex items-center gap-2 text-sm text-slate-500 overflow-x-auto whitespace-nowrap scrollbar-hide">
            <Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3 shrink-0" />
            <Link href={`/?category=${product.category.slug}`} className="hover:text-indigo-600 transition-colors">{product.category.name}</Link>
            <ChevronRight className="w-3 h-3 shrink-0" />
            <span className="text-slate-900 font-medium truncate max-w-[200px]">{product.name}</span>
        </div>
      </div>

      <main className="container mx-auto px-4 max-w-7xl pb-20">
        
        {/* === MAIN CARD === */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden p-6 lg:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                
                {/* KOLOM KIRI (GAMBAR) */}
                <div className="lg:col-span-5 space-y-4">
                    <div className="relative aspect-square w-full bg-slate-100 rounded-2xl overflow-hidden border border-slate-100 shadow-inner group">
                        {/* GUNAKAN displayImage YANG SUDAH DIHITUNG */}
                        <Image 
                            src={displayImage} 
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                            priority
                        />
                         {product.stock <= 0 && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
                                <span className="bg-red-600 text-white px-4 py-2 rounded-full font-bold text-sm tracking-wide shadow-lg">STOK HABIS</span>
                            </div>
                         )}
                    </div>
                    
                    {/* Thumbnail (Sementara pakai gambar sama karena belum ada fitur multi-image) */}
                    <div className="grid grid-cols-4 gap-3">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className={`relative aspect-square bg-slate-50 rounded-xl overflow-hidden border cursor-pointer transition-all ${i===1 ? 'border-indigo-600 ring-2 ring-indigo-100 opacity-100' : 'border-slate-200 hover:border-indigo-300 opacity-70 hover:opacity-100'}`}>
                                 <Image 
                                    src={displayImage} 
                                    alt={`thumb-${i}`}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-4">
                        <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100">
                            <ShieldCheck className="w-4 h-4 text-green-600" />
                            <span>Kualitas Terjamin</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100">
                            <Zap className="w-4 h-4 text-yellow-500" />
                            <span>Respon Cepat</span>
                        </div>
                    </div>
                </div>

                {/* KOLOM KANAN (INFO) */}
                <div className="lg:col-span-7 flex flex-col">
                    
                    <div className="mb-6 border-b border-slate-50 pb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border ${badgeColor}`}>
                                {product.category.name}
                            </span>
                            {product.stock > 0 && (
                                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-green-100 text-green-700 border border-green-200 flex items-center gap-1">
                                    <Package size={10} /> Stok: {product.stock}
                                </span>
                            )}
                        </div>

                        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3 leading-tight">
                            {product.name}
                        </h1>

                        <div className="flex items-center gap-4 text-sm">
                            <div className="flex text-yellow-400">
                                {[...Array(4)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                                <Star className="w-4 h-4 text-slate-200 fill-slate-200" />
                            </div>
                            <span className="text-slate-400 font-medium">4.8 (24 Review)</span>
                        </div>
                    </div>

                    <div className="mb-8">
                        <p className="text-slate-400 text-sm font-medium mb-1">Harga Sewa / Layanan</p>
                        <div className="flex items-end gap-2">
                            <span className="text-4xl font-extrabold text-indigo-600 tracking-tight">
                                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(product.price)}
                            </span>
                            {!isPrinting && <span className="text-slate-400 mb-2 font-medium">/ 24 Jam</span>}
                        </div>
                    </div>

                    <div className="grow">
                         <ProductInfoTabs 
                            description={product.description} 
                            specifications={product.specifications} 
                        />
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-100">
                         {/* Kirim data yang sudah di-convert harganya (Number) dan Image URL yang benar */}
                         <ProductActions 
                            product={{
                                id: product.id,
                                name: product.name,
                                price: product.price, // Sudah number
                                imageUrl: displayImage, // Gunakan gambar demo/asli
                                categoryName: product.category.name,
                                stock: product.stock
                            }} 
                        />
                    </div>

                </div>
            </div>
        </div>

        {/* RELATED PRODUCTS */}
        <div className="mt-16">
            <div className="flex items-end justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Produk Serupa</h2>
                    <p className="text-slate-500 text-sm mt-1">Mungkin Anda juga membutuhkan ini</p>
                </div>
                <Link href={`/?category=${product.category.slug}`} className="text-indigo-600 text-sm font-bold hover:bg-indigo-50 px-4 py-2 rounded-full transition-all">
                    Lihat Semua &rarr;
                </Link>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {relatedProducts.map((relProduct) => (
                    <ProductCard
                        key={relProduct.id}
                        id={relProduct.id}
                        name={relProduct.name}
                        price={relProduct.price} // Sudah number
                        imageUrl={relProduct.imageUrl || ''} // ProductCard akan menangani demo image sendiri
                        categoryName={relProduct.category.name} 
                    />
                ))}
                
                {relatedProducts.length === 0 && (
                    <div className="col-span-full py-12 text-center border border-dashed border-slate-200 rounded-2xl bg-white">
                        <p className="text-slate-400 font-medium">Tidak ada produk lain di kategori ini.</p>
                    </div>
                )}
            </div>
        </div>

      </main>
    </div>
  );
}