// app/(public)/cart/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { Trash2, Plus, Minus, MessageCircle, ArrowLeft } from 'lucide-react';

export default function CartPage() {
  const { items, addItem, decreaseItem, removeItem, totalPrice } = useCart();
  const [mounted, setMounted] = useState(false);

  // State untuk Form Input Checkout (Sesuai BRD Fitur 2 - Input Nama & Tanggal) 
  const [customerName, setCustomerName] = useState('');
  const [rentalDate, setRentalDate] = useState('');

  // Hydration fix (Wajib untuk Zustand + Next.js App Router)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // --- LOGIKA CHECKOUT WA ---
  const handleCheckout = () => {
    // Validasi Form Dulu
    if (!customerName || !rentalDate) {
      alert("Mohon lengkapi Nama dan Tanggal Sewa terlebih dahulu.");
      return;
    }

    const phoneNumber = "6281234567890"; // GANTI NOMOR ADMIN
    
    // Format Pesan (Sesuai BRD: Template Pesan Otomatis) 
    let message = `Halo Admin OXI, saya ingin menyewa:\n\n`;
    message += `👤 Nama: ${customerName}\n`;
    message += `📅 Tanggal Sewa: ${rentalDate}\n`;
    message += `--------------------------\n`;
    
    items.forEach((item, index) => {
        const subtotal = item.price * item.quantity;
        message += `${index + 1}. ${item.name} (${item.quantity}x) - Rp ${subtotal.toLocaleString('id-ID')}\n`;
    });
    
    message += `--------------------------\n`;
    message += `💰 *Total Estimasi: Rp ${totalPrice().toLocaleString('id-ID')}*`;
    message += `\n\nMohon info ketersediaannya. Terima kasih!`;

    // Redirect ke WA [cite: 98]
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  // Tampilan Jika Kosong
  if (items.length === 0) {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <MessageCircle className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Keranjang Kosong</h2>
            <p className="text-gray-500 mb-6">Yuk cari barang kebutuhanmu sekarang.</p>
            <Link href="/" className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors">
                Mulai Belanja
            </Link>
        </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Breadcrumb / Back Button */}
        <div className="mb-6">
            <Link href="/" className="flex items-center text-gray-500 hover:text-indigo-600 transition-colors w-fit">
                <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Katalog
            </Link>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        {/* LAYOUT GRID 2 KOLOM (Sesuai Wireframe) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* KOLOM KIRI: DAFTAR BARANG (Span 2) */}
            <div className="lg:col-span-2 space-y-4">
                
                {/* Header List (Opsional, untuk 'Select All') */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center">
                    <input type="checkbox" checked readOnly className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 mr-3" />
                    <span className="font-semibold text-gray-700">Pilih Semua ({items.length})</span>
                </div>

                {/* Looping Item */}
                {items.map((item) => (
                    <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        
                        {/* Checkbox */}
                        <div className="flex-shrink-0 mt-2 sm:mt-0">
                             <input type="checkbox" checked readOnly className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500" />
                        </div>

                        {/* Gambar Produk */}
                        <div className="relative w-24 h-24 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 border border-gray-200">
                             <Image 
                                src={item.imageUrl || 'https://placehold.co/150'} 
                                alt={item.name} 
                                fill 
                                className="object-cover"
                             />
                        </div>

                        {/* Detail Produk */}
                        <div className="flex-grow min-w-0">
                            <h3 className="text-base font-semibold text-gray-800 truncate">{item.name}</h3>
                            <p className="text-sm text-gray-500 mb-2">{item.category || 'Rental Item'}</p>
                            <p className="text-indigo-600 font-bold">
                                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(item.price)}
                            </p>
                        </div>

                        {/* Kontrol Kuantitas & Hapus (Diposisikan di kanan atau bawah di mobile) */}
                        <div className="flex flex-col items-end gap-3 w-full sm:w-auto">
                            <button 
                                onClick={() => removeItem(item.id)}
                                className="text-gray-400 hover:text-red-500 transition-colors"
                                aria-label="Hapus item"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                            
                            <div className="flex items-center border border-gray-300 rounded-md">
                                <button 
                                    onClick={() => decreaseItem(item.id)}
                                    className="p-1 hover:bg-gray-100 text-gray-600 disabled:opacity-50"
                                    disabled={item.quantity <= 1}
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="px-3 py-1 text-sm font-medium text-gray-800 min-w-[2.5rem] text-center border-x border-gray-300">
                                    {item.quantity}
                                </span>
                                <button 
                                    onClick={() => addItem(item)} // addItem logika +1 kalau barang udah ada
                                    className="p-1 hover:bg-gray-100 text-gray-600"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                    </div>
                ))}
            </div>

            {/* KOLOM KANAN: RINGKASAN BELANJA (Span 1) */}
            <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-24">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Ringkasan Belanja</h2>
                    
                    {/* Input Form Sederhana (Sesuai BRD Fitur 2)  */}
                    <div className="space-y-3 mb-6">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1">Nama Penyewa</label>
                            <input 
                                type="text" 
                                className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                placeholder="Masukkan nama Anda"
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1">Rencana Tanggal Sewa</label>
                            <input 
                                type="date" 
                                className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                value={rentalDate}
                                onChange={(e) => setRentalDate(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-4 space-y-2 mb-6">
                        <div className="flex justify-between text-gray-600">
                            <span>Total Harga ({items.length} barang)</span>
                            <span>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(totalPrice())}</span>
                        </div>
                        {/* Diskon atau biaya lain bisa ditambah di sini */}
                        <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-100 mt-2">
                            <span>Total Tagihan</span>
                            <span className="text-indigo-600">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(totalPrice())}</span>
                        </div>
                    </div>

                    <button 
                        onClick={handleCheckout}
                        className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                    >
                        Checkout (WhatsApp)
                    </button>
                    
                    <p className="text-xs text-gray-400 mt-4 text-center">
                        *Transaksi akan dilanjutkan ke WhatsApp Admin untuk konfirmasi stok.
                    </p>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}