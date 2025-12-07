// app/(public)/profile/page.tsx

import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-server';
import { prisma } from '@/lib/prisma';
import { 
  User, Package, Award, CreditCard, Settings, History, 
  ShoppingBag, Calendar, CheckCircle, Clock, AlertCircle, Printer, Camera
} from 'lucide-react';
import Link from 'next/link';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  
  // [FIX 1] Redirect ke Login jika tidak ada session, JANGAN ke /profile lagi
  if (!session?.user?.id) {
    redirect('/auth/login?callbackUrl=/profile');
  }

  // Jika user adalah staff/admin, redirect ke dashboard admin
  if (session.user.type === 'user') {
    redirect('/dashboard');
  }

  // Ambil Data Customer + Order History Terbaru
  const customer = await prisma.customer.findUnique({
    where: { id: session.user.id },
    include: {
      orders: {
        take: 5, // Ambil 5 order terakhir
        orderBy: { createdAt: 'desc' },
        include: {
          rentalOrders: {
            include: { items: { include: { product: true } } }
          },
          printOrders: true
        }
      }
    }
  });

  if (!customer) {
    redirect('/auth/login');
  }

  // [LOGIC] Hitung Statistik Real
  const totalOrders = await prisma.order.count({ where: { customerId: customer.id } });
  
  // Hitung total pengeluaran (hanya yang status PAID/SELESAI)
  const spentResult = await prisma.order.aggregate({
    _sum: { totalAmount: true },
    where: { 
      customerId: customer.id,
      status: { in: ['PAID', 'SELESAI', 'DISEWA', 'DIPROSES'] }
    }
  });
  const totalSpent = Number(spentResult._sum.totalAmount || 0);

  // Helper Icon Status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SELESAI': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'DIPROSES': case 'DISEWA': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'PENDING': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SELESAI': return 'bg-green-100 text-green-800';
      case 'DIPROSES': case 'DISEWA': return 'bg-blue-100 text-blue-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 font-sans">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Dashboard Profil</h1>
              <p className="text-slate-600 mt-1">
                Halo, <span className="font-semibold text-indigo-600">{customer.name}</span>!
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* --- SIDEBAR MENU --- */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24 border border-slate-100">
              <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-50">
                <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xl font-bold">
                  {customer.name.charAt(0).toUpperCase()}
                </div>
                <div className="overflow-hidden">
                  <h3 className="font-bold text-slate-800 truncate">{customer.name}</h3>
                  <p className="text-xs text-slate-500 truncate">{customer.email || customer.whatsapp}</p>
                </div>
              </div>

              <nav className="space-y-1">
                <Link href="/profile" className="flex items-center gap-3 p-3 rounded-xl bg-indigo-50 text-indigo-700 font-bold text-sm">
                  <User size={18} /> Dashboard
                </Link>
                <Link href="/profile/order" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-slate-600 font-medium text-sm transition-colors">
                  <Package size={18} /> Pesanan Saya
                </Link>
                <Link href="/wishlist" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-slate-600 font-medium text-sm transition-colors">
                  <Award size={18} /> Wishlist
                </Link>
                <Link href="/profile/edit" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-slate-600 font-medium text-sm transition-colors">
                  <Settings size={18} /> Edit Profil
                </Link>
                <Link href="/api/auth/signout?callbackUrl=/" className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 text-red-600 font-medium text-sm transition-colors mt-4">
                  <History size={18} /> Keluar
                </Link>
              </nav>
            </div>
          </div>

          {/* --- MAIN CONTENT --- */}
          <div className="lg:col-span-3 space-y-8">
            
            {/* 1. STATS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Pesanan</p>
                    <h3 className="text-3xl font-bold text-slate-800 mt-2">{totalOrders}</h3>
                  </div>
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                    <Package size={24} />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Belanja</p>
                    <h3 className="text-3xl font-bold text-slate-800 mt-2">
                      {new Intl.NumberFormat('id-ID', { notation: "compact", style: 'currency', currency: 'IDR' }).format(totalSpent)}
                    </h3>
                  </div>
                  <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                    <CreditCard size={24} />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100 bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-indigo-200 text-xs font-bold uppercase tracking-wider">Poin Rewards</p>
                    <h3 className="text-3xl font-bold mt-2">
                      {customer.totalPoints.toLocaleString()}
                    </h3>
                  </div>
                  <div className="p-3 bg-white/20 rounded-xl text-white backdrop-blur-sm">
                    <Award size={24} />
                  </div>
                </div>
                <p className="text-xs text-indigo-200 mt-4">Kumpulkan poin dari setiap transaksi!</p>
              </div>
            </div>

            {/* 2. RECENT ORDERS LIST */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h2 className="font-bold text-slate-800">Pesanan Terbaru</h2>
                <Link href="/profile/orders" className="text-sm text-indigo-600 font-bold hover:underline">
                  Lihat Semua
                </Link>
              </div>

              {customer.orders.length === 0 ? (
                <div className="text-center py-16 px-6">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingBag className="text-slate-300 w-10 h-10" />
                  </div>
                  <h3 className="text-slate-800 font-bold mb-1">Belum ada pesanan</h3>
                  <p className="text-slate-500 text-sm mb-6">Yuk mulai belanja kebutuhan event kamu sekarang.</p>
                  <Link href="/" className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-700 transition">
                    Mulai Belanja
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {customer.orders.map((order) => {
                    // Logic Menentukan Label Order
                    let title = "Transaksi Toko Oxi";
                    let itemsCount = 0;
                    let type = "UNKNOWN";

                    if (order.rentalOrders.length > 0) {
                        type = "RENTAL";
                        const firstItem = order.rentalOrders[0].items[0]?.product.name || "Alat Rental";
                        itemsCount = order.rentalOrders[0].items.length;
                        title = itemsCount > 1 ? `${firstItem} & ${itemsCount - 1} lainnya` : firstItem;
                    } else if (order.printOrders.length > 0) {
                        type = "PRINT";
                        title = order.printOrders[0].serviceType + " (" + order.printOrders.length + " file)";
                    }

                    return (
                      <div key={order.id} className="p-6 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                        <div className="flex gap-4 items-start">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${type === 'RENTAL' ? 'bg-orange-50 text-orange-600' : 'bg-purple-50 text-purple-600'}`}>
                             {type === 'RENTAL' ? <Camera size={20} /> : <Printer size={20} />}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-800 text-sm">{title}</h4>
                            <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 font-medium">
                                <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                                    INV-{order.uniqueCode || order.id.slice(-4).toUpperCase()}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Calendar size={12}/> 
                                    {new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto mt-2 sm:mt-0 pl-16 sm:pl-0">
                            <div className="text-right">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                                    {getStatusIcon(order.status)} {order.status}
                                </span>
                            </div>
                            <div className="text-right min-w-[100px]">
                                <p className="text-xs text-slate-400 font-medium mb-0.5">Total Belanja</p>
                                <p className="text-indigo-600 font-bold">
                                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(order.totalAmount))}
                                </p>
                            </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}