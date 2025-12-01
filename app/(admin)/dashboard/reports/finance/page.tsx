// app/admin/reports/finance/page.tsx

import React from 'react';
import { DollarSign, BarChart, TrendingUp, TrendingDown, Clock } from 'lucide-react';

// PASTIKAN PATH INI BENAR SESUAI LOKASI FILE ANDA
import SalesTrendChart from '../../../../../components/ui/admin/SalesTrendChart'; 
import ProfitDistributionChart from '../../../../../components/ui/admin/ProfitDistributionChart'; // <-- IMPORT GRAFIK DONUT

// =================================================================
// KOMPONEN STAT CARD (LOKAL) - TIDAK BERUBAH
// =================================================================

type StatCardProps = {
    title: string;
    value: string;
    icon: React.ElementType;
    change: string;
    color: 'green' | 'red' | 'blue' | 'yellow';
    description: string;
};

const colorMap = {
    green: 'text-green-600 bg-green-100',
    red: 'text-red-600 bg-red-100',
    blue: 'text-blue-600 bg-blue-100',
    yellow: 'text-yellow-600 bg-yellow-100',
};

function StatCard({ title, value, icon: Icon, change, color, description }: StatCardProps) {
    const TrendIcon = color === 'green' ? TrendingUp : color === 'red' ? TrendingDown : BarChart;
    const colorTextClass = colorMap[color].split(' ')[0];
    const trendTextColorClass = (color === 'green' || color === 'red') ? colorTextClass : 'text-gray-500';

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex flex-col gap-2 transition-transform hover:scale-[1.01] duration-300">
            {/* Ikon */}
            <div className={`w-10 h-10 flex items-center justify-center rounded-full ${colorMap[color]} mb-2`}>
                <Icon className={`w-6 h-6 ${colorTextClass}`} />
            </div>
            
            <div className="text-xs text-gray-500 font-medium">{title}</div>
            <div className="text-2xl font-bold text-gray-800">{value}</div>
            
            {/* Baris Change */}
            <div className="flex items-center gap-2 text-sm">
                {/* Ikon Tren */}
                <TrendIcon className={`w-4 h-4 ${trendTextColorClass}`} /> 
                {/* Persentase/Nilai Perubahan */}
                <span className={`${trendTextColorClass} font-semibold`}>{change}</span>
                {/* Deskripsi Tambahan */}
                <span className="text-gray-400">{description}</span>
            </div>
        </div>
    );
}

// =================================================================
// DATA MOCK - TIDAK BERUBAH
// =================================================================
const mockTopProducts = [
    { name: 'Sewa Toga Baru Unhas', units: 45, revenue: 6750000 },
    { name: 'Almamater Unhas (Bahan Drill)', units: 20, revenue: 4000000 },
    { name: 'Papan Akrilik Berlogo', units: 80, revenue: 3500000 },
    { name: 'Jilid Skripsi', units: 150, revenue: 2250000 },
];


export default function FinancialReportPage() {
    return (
        <div className="space-y-8">
            
            {/* 1. KARTU METRIK UTAMA (TIDAK BERUBAH) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Total Revenue"
                    value="Rp 15.25 Jt"
                    icon={DollarSign}
                    change="+12.5%"
                    color="green"
                    description="vs Bulan Lalu"
                />
                <StatCard 
                    title="Biaya Operasional"
                    value="Rp 3.10 Jt"
                    icon={TrendingDown}
                    change="-4.2%"
                    color="red"
                    description="vs Bulan Lalu"
                />
                <StatCard 
                    title="Laba Bersih"
                    value="Rp 12.15 Jt"
                    icon={BarChart}
                    change="+18.8%"
                    color="blue"
                    description="vs Target"
                />
                <StatCard 
                    title="Piutang (Tempo)"
                    value="Rp 750 Rb"
                    icon={Clock}
                    change="2 Transaksi"
                    color="yellow"
                    description="Perlu ditagih"
                />
            </div>

            {/* 2. VISUALISASI DATA (Grafik & Ringkasan Performa) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Grafik Utama (Tren Pendapatan) */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                    <h3 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Tren Penjualan Tahunan</h3>
                    
                    {/* INTEGRASI GRAFIK TREN */}
                    <SalesTrendChart />
                    
                    <div className='mt-4 text-xs text-gray-500'>
                        Analisis menunjukkan pertumbuhan stabil 15% sejak awal kuartal.
                    </div>
                </div>

                {/* Ringkasan Biaya/Laba Kotor */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                    <h3 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Distribusi Laba Kotor</h3>
                    
                    {/* INTEGRASI GRAFIK DONUT */}
                    <ProfitDistributionChart />
                    
                    <p className="text-sm font-medium text-gray-700 mt-2">
                        Margin Rata-rata: <span className="text-green-600 font-bold">45%</span>
                    </p>
                    <p className="text-xs text-gray-500">
                        Pastikan Harga Pokok Penjualan (HPP) sudah diinput dengan benar.
                    </p>
                </div>
            </div>

            {/* 3. TABEL DETAIL: Laporan Produk Terlaris (TIDAK BERUBAH) */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Top 4 Produk Berdasarkan Revenue</h3>
                
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Peringkat</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Produk</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Terjual/Sewa</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total Revenue</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {mockTopProducts.map((product, index) => (
                                <tr key={product.name} className={index < 2 ? 'bg-indigo-50/50' : ''}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-indigo-600">#{index + 1}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.units} unit</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-right text-gray-800">Rp {product.revenue.toLocaleString('id-ID')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
        </div>
    );
}