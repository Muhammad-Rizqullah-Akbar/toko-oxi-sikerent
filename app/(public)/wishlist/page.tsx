'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useWishlist } from '@/hooks/useWishlist';
import { useCart } from '@/hooks/useCart';
import { Trash2, ShoppingCart, HeartOff, ArrowRight, ArrowLeft } from 'lucide-react';

// [FIX] Definisi Tipe Item untuk transfer (Mengganti 'any')
type WishlistTransferItem = {
    id: string;
    name: string;
    price: number;
    imageUrl: string | null;
    category: string;
};

export default function WishlistPage() {
  const { items, removeItem } = useWishlist();
  const { addItem } = useCart();
  const [mounted, setMounted] = useState(false);

  // Hydration fix
  useEffect(() => {
    // [FIX 1] Mengabaikan peringatan ESLint di baris ini
    // eslint-disable-next-line react-hooks/exhaustive-deps
    setMounted(true);
  }, []);

  // Fungsi Pindah ke Cart
  // [FIX 2] Menggunakan tipe data yang spesifik (WishlistTransferItem)
  const moveToCart = (item: WishlistTransferItem) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      imageUrl: item.imageUrl,
      category: item.category,
      quantity: 1,
    });
    alert(`"${item.name}" berhasil ditambahkan ke Keranjang!`);
  };

  if (!mounted) return null;

  return (
    <div className="bg-slate-50 min-h-screen font-sans pb-20">
      
      {/* HEADER */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-30">
        <div className="container mx-auto px-4 max-w-6xl py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Link href="/" className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                    <ArrowLeft size={20} />
                </Link>
                <h1 className="text-xl font-bold text-slate-800">Wishlist Saya</h1>
            </div>
            <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full font-medium">
                {items.length} Barang
            </span>
        </div>
      </div>

      <main className="container mx-auto px-4 max-w-6xl mt-8">
        
        {/* EMPTY STATE */}
        {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-slate-100">
                    <HeartOff className="w-12 h-12 text-slate-300" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Wishlist Masih Kosong</h2>
                <p className="text-slate-500 mb-8 max-w-md">
                    Simpan barang favoritmu di sini agar tidak lupa saat ingin menyewa nanti.
                </p>
                <Link
                    href="/"
                    className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                >
                    Mulai Jelajah
                </Link>
            </div>
        ) : (
            /* GRID ITEMS */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
                    <div 
                        key={item.id} 
                        className="bg-white rounded-2xl border border-slate-100 p-4 flex gap-4 hover:shadow-lg transition-shadow group relative overflow-hidden"
                    >
                        {/* Gambar */}
                        <Link href={`/product/${item.id}`} className="relative w-28 h-28 bg-slate-100 rounded-xl overflow-hidden shrink-0 border border-slate-100">
                            <Image 
                                src={item.imageUrl || '/images/placeholder.jpg'} 
                                alt={item.name}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                        </Link>

                        {/* Info & Aksi */}
                        {/* [FIX 3] flex-grow diubah menjadi grow */}
                        <div className="flex flex-col justify-between grow min-w-0">
                            <div>
                                <div className="flex justify-between items-start">
                                    <Link href={`/product/${item.id}`} className="hover:text-indigo-600 transition-colors">
                                        <h3 className="font-bold text-slate-800 line-clamp-2 text-sm leading-snug mb-1">
                                            {item.name}
                                        </h3>
                                    </Link>
                                </div>
                                <p className="text-xs text-slate-500 mb-2 bg-slate-50 inline-block px-2 py-0.5 rounded border border-slate-100">
                                    {item.category}
                                </p>
                                <p className="text-indigo-600 font-bold">
                                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(item.price)}
                                </p>
                            </div>

                            {/* Tombol Aksi Bawah */}
                            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-50">
                                <button 
                                    onClick={() => removeItem(item.id)}
                                    className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors border border-transparent hover:border-red-100"
                                    title="Hapus"
                                >
                                    <Trash2 size={18} />
                                </button>
                                <button 
                                    onClick={() => moveToCart(item as WishlistTransferItem)} // Menggunakan item yang sudah diclean
                                    className="grow py-2 px-3 bg-indigo-50 text-indigo-700 text-sm font-bold rounded-lg hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center gap-2 group/btn"
                                >
                                    <ShoppingCart size={16} />
                                    <span className="text-xs sm:text-sm">Sewa</span>
                                    <ArrowRight size={14} className="opacity-0 group-hover/btn:opacity-100 -ml-2 group-hover/btn:ml-0 transition-all" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}

      </main>
    </div>
  );
}