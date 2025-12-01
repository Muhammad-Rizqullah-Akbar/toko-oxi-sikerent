"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart"; 
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, ArrowRight, AlertCircle } from "lucide-react";

export default function CartPage() {
  const { items, addItem, decreaseItem, removeItem, totalPrice } = useCart();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Hydration fix
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    setMounted(true);
  }, []);

  // Cegah render sebelum client-side siap (Fix Hydration Error)
  if (!mounted) return null;

  // --- TAMPILAN JIKA KOSONG ---
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-center px-4">
        <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-slate-100">
          <ShoppingBag className="w-12 h-12 text-slate-300" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Keranjang Belanja Kosong</h2>
        <p className="text-slate-500 mb-8 max-w-md">
          Sepertinya Anda belum menambahkan barang apapun. Yuk cari barang kebutuhan eventmu sekarang.
        </p>
        <Link
          href="/"
          className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
        >
          Mulai Belanja
        </Link>
      </div>
    );
  }

  // --- TAMPILAN UTAMA ---
  return (
    <div className="bg-slate-50 min-h-screen pb-20 font-sans">
      {/* Header Simple */}
      <div className="bg-white border-b border-slate-100 py-4 mb-8 sticky top-0 z-10">
        <div className="container mx-auto px-4 max-w-6xl">
          <Link href="/" className="flex items-center text-slate-500 hover:text-indigo-600 transition-colors w-fit text-sm font-medium">
            <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Katalog
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Keranjang Belanja</h1>
        <p className="text-slate-500 mb-8">Anda memiliki {items.length} item dalam keranjang</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- KOLOM KIRI: LIST ITEM --- */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center gap-6 group transition-all hover:border-indigo-100"
              >
                {/* Gambar Produk */}
                {/* FIX: flex-shrink-0 menjadi shrink-0 */}
                <div className="relative w-full sm:w-28 h-28 bg-slate-100 rounded-xl overflow-hidden shrink-0 border border-slate-100">
                  <Image
                    src={item.imageUrl || "/images/placeholder.jpg"}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Detail Produk */}
                {/* FIX: flex-grow menjadi grow */}
                <div className="grow min-w-0 w-full">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                        {/* Label Kategori */}
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md mb-2 inline-block ${
                            item.category?.toLowerCase().includes('cetak') || item.name.toLowerCase().includes('cetak')
                            ? 'bg-orange-100 text-orange-700' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                            {item.category || 'Rental'}
                        </span>
                        <h3 className="text-lg font-bold text-slate-800 line-clamp-2 leading-tight">
                            {item.name}
                        </h3>
                    </div>
                    <button
                        onClick={() => removeItem(item.id)}
                        className="text-slate-300 hover:text-red-500 transition-colors p-2 -mr-2"
                        title="Hapus item"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex justify-between items-end mt-4">
                    <p className="text-indigo-600 font-bold text-lg">
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                      }).format(item.price)}
                    </p>

                    {/* Kontrol Kuantitas */}
                    <div className="flex items-center bg-slate-50 rounded-lg border border-slate-200 p-1">
                      <button
                        onClick={() => decreaseItem(item.id)}
                        disabled={item.quantity <= 1}
                        className="w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm text-slate-600 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center font-bold text-slate-800 text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => addItem(item)}
                        className="w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm text-slate-600 hover:text-indigo-600 transition-all"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* --- KOLOM KANAN: RINGKASAN --- */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 sticky top-24">
              <h2 className="text-lg font-bold text-slate-800 mb-6">Ringkasan Pesanan</h2>

              <div className="space-y-3 mb-6 border-b border-slate-100 pb-6">
                <div className="flex justify-between text-slate-500 text-sm">
                  <span>Total Harga ({items.length} barang)</span>
                  <span className="font-medium text-slate-700">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(totalPrice())}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-end mb-8">
                <div>
                    <span className="block text-slate-500 text-sm mb-1">Total Sementara</span>
                    <span className="text-2xl font-bold text-slate-800">
                    {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                    }).format(totalPrice())}
                    </span>
                </div>
              </div>

              {/* Tombol Lanjut ke Checkout */}
              <button
                onClick={() => router.push('/checkout')}
                className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 flex items-center justify-center group"
              >
                Lanjut Pembayaran <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* FIX: flex-shrink-0 menjadi shrink-0 */}
              <div className="mt-4 bg-blue-50 p-3 rounded-lg flex items-start gap-3">
                 <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                 <p className="text-xs text-blue-800 leading-relaxed">
                    Pastikan pesanan Anda sudah benar. Detail pengiriman dan upload file desain akan dilakukan di halaman selanjutnya.
                 </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}