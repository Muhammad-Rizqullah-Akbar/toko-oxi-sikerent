// app/(admin)/dashboard/page.tsx
import React from 'react';
import { prisma } from '@/lib/prisma';
import { Package, ShoppingCart, AlertCircle, Users } from 'lucide-react'; // Ikon pelengkap

// Fungsi Helper untuk Card Statistik
function StatCard({ title, value, icon: Icon, color }: any) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center space-x-4">
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  // 1. MENGAMBIL DATA RINGKASAN DARI DATABASE
  // Kita pakai Promise.all biar request ke database jalan barengan (Paralel) -> Lebih Cepat
  const [
    totalProducts,
    totalStock,
    activeRentals,
    recentOrders
  ] = await Promise.all([
    
    // Hitung Total Jenis Produk
    prisma.product.count(),
    
    // Hitung Total Stok Fisik (Sum kolom stock)
    prisma.product.aggregate({
      _sum: { stock: true }
    }),

    // Hitung Rental yang sedang aktif (Status = DISEWA atau TERLAMBAT)
    prisma.rentalOrder.count({
      where: {
        status: { in: ['DISEWA', 'TERLAMBAT'] }
      }
    }),

    // Ambil 5 Transaksi Terakhir untuk Tabel Ringkasan
    prisma.rentalOrder.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        customer: true, // Join ke tabel Customer biar dapet namanya
      }
    })
  ]);

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Overview Dashboard</h1>

      {/* 2. BAGIAN KARTU STATISTIK (Sesuai BRD Fitur 8) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        <StatCard 
          title="Total Jenis Barang" 
          value={totalProducts} 
          icon={Package} 
          color="bg-blue-500" 
        />
        
        <StatCard 
          title="Total Stok Tersedia" 
          value={totalStock._sum.stock || 0} // Handle null kalo DB kosong
          icon={ShoppingCart} 
          color="bg-emerald-500" 
        />
        
        <StatCard 
          title="Sedang Disewa" 
          value={activeRentals} 
          icon={Users} 
          color="bg-orange-500" 
        />
        
        <StatCard 
          title="Perlu Perhatian" 
          value={0} // Nanti diisi logika 'Stok Menipis' atau 'Terlambat'
          icon={AlertCircle} 
          color="bg-red-500" 
        />
        
      </div>

      {/* 3. TABEL AKTIVITAS TERBARU */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">Transaksi Rental Terbaru</h3>
          <button className="text-indigo-600 text-sm hover:underline">Lihat Semua</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3">Invoice</th>
                <th className="px-6 py-3">Pelanggan</th>
                <th className="px-6 py-3">Tanggal Sewa</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {order.invoiceCode}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {order.customer.name}
                    <div className="text-xs text-gray-400">{order.customer.whatsapp}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(order.startDate).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-6 py-4">
                    {/* Badge Status Sederhana */}
                    <span className={`px-2 py-1 text-xs rounded-full font-semibold
                      ${order.status === 'SELESAI' ? 'bg-green-100 text-green-800' : 
                        order.status === 'DISEWA' ? 'bg-orange-100 text-orange-800' : 
                        'bg-gray-100 text-gray-800'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-right font-medium text-gray-900">
                    Rp {order.totalPrice.toLocaleString('id-ID')}
                  </td>
                </tr>
              ))}
              
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                    Belum ada transaksi masuk.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}