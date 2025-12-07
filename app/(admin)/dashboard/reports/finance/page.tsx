'use client';

import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Clock, ShoppingBag, Loader2, RefreshCcw } from 'lucide-react';
import { getFinanceData } from '@/app/actions/admin/finance';

export default function FinancePage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  const loadData = async () => {
    setLoading(true);
    const res = await getFinanceData();
    setData(res);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin mb-2 text-indigo-600" />
        <p>Sedang menghitung duit...</p>
      </div>
    );
  }

  // Format Rupiah Helper
  const rp = (n: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold text-gray-800">Laporan Keuangan</h1>
            <p className="text-gray-500 text-sm">Ringkasan pendapatan dari transaksi rental & cetak.</p>
        </div>
        <button onClick={loadData} className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 shadow-sm" title="Refresh Data">
            <RefreshCcw size={20} />
        </button>
      </div>

      {/* 1. KARTU STATISTIK UTAMA */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Revenue */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-indigo-100 flex items-start gap-4 relative overflow-hidden">
            <div className="p-3 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-200 z-10">
                <DollarSign size={24} />
            </div>
            <div className="z-10">
                <p className="text-sm font-medium text-slate-500">Total Pendapatan (Masuk)</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">{rp(data.totalRevenue)}</h3>
            </div>
            {/* Dekorasi Background */}
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-indigo-50 rounded-full opacity-50" />
        </div>

        {/* Potential Revenue */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-amber-100 flex items-start gap-4">
            <div className="p-3 bg-amber-100 rounded-xl text-amber-600">
                <Clock size={24} />
            </div>
            <div>
                <p className="text-sm font-medium text-slate-500">Potensi (Menunggu Bayar)</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">{rp(data.potentialRevenue)}</h3>
            </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 flex items-start gap-4">
            <div className="p-3 bg-emerald-100 rounded-xl text-emerald-600">
                <ShoppingBag size={24} />
            </div>
            <div>
                <p className="text-sm font-medium text-slate-500">Total Transaksi Sukses</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">{data.totalOrders}</h3>
            </div>
        </div>
      </div>

      {/* 2. GRAFIK & TABEL (Grid Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* GRAFIK MANUAL (Simple CSS Bar Chart) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="text-indigo-600" size={20} />
                <h3 className="text-lg font-bold text-gray-800">Tren Pendapatan Bulanan</h3>
            </div>
            
            {data.chartData.length > 0 ? (
                <div className="h-64 flex items-end justify-between gap-2 sm:gap-4 mt-8">
                    {data.chartData.map((item: any, idx: number) => {
                        // Hitung tinggi bar (persentase dari max value)
                        const maxVal = Math.max(...data.chartData.map((d: any) => d.value));
                        const heightPercent = maxVal > 0 ? (item.value / maxVal) * 100 : 0;
                        
                        return (
                            <div key={idx} className="flex-1 flex flex-col items-center group">
                                {/* Tooltip Hover */}
                                <div className="mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-xs px-2 py-1 rounded absolute -mt-8">
                                    {rp(item.value)}
                                </div>
                                {/* The Bar */}
                                <div 
                                    className="w-full bg-indigo-500 rounded-t-lg hover:bg-indigo-600 transition-all relative"
                                    style={{ height: `${heightPercent}%`, minHeight: '4px' }}
                                ></div>
                                {/* Label Bulan */}
                                <span className="text-xs text-gray-500 mt-2 font-medium">{item.name}</span>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div className="h-48 flex items-center justify-center text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    Belum ada data grafik
                </div>
            )}
        </div>

        {/* TOP PRODUCTS LIST */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Produk Terlaris</h3>
            <div className="space-y-4">
                {data.topProducts.length > 0 ? (
                    data.topProducts.map((prod: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className={`text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full ${idx === 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>
                                        {idx + 1}
                                    </span>
                                    <p className="text-sm font-medium text-gray-800 line-clamp-1">{prod.name}</p>
                                </div>
                                <p className="text-xs text-gray-500 mt-0.5 ml-7">{prod.count} kali disewa</p>
                            </div>
                            <span className="text-sm font-bold text-indigo-600">
                                {new Intl.NumberFormat('id-ID', { notation: "compact", compactDisplay: "short", style: "currency", currency: "IDR" }).format(prod.revenue)}
                            </span>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-gray-400 text-center py-4">Belum ada data penjualan.</p>
                )}
            </div>
            
            {/* Info Box */}
            <div className="mt-6 bg-blue-50 p-3 rounded-lg border border-blue-100">
                <p className="text-xs text-blue-700 leading-relaxed">
                    <strong>Tips:</strong> Data ini dihitung berdasarkan pesanan yang statusnya sudah "PAID" atau selesai.
                </p>
            </div>
        </div>

      </div>
    </div>
  );
}