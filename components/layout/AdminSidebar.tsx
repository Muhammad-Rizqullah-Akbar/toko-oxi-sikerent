// components/layout/AdminSidebar.tsx

import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, Package, Boxes, Gift, Bell, LogOut, DollarSign } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Produk', href: '/dashboard/products', icon: Package },
  { name: 'Kategori', href: '/dashboard/categories', icon: Package },
  { name: 'Inventaris', href: '/dashboard/inventories', icon: Boxes },
  { name: 'Point Reward', href: '/dashboard/point-reward', icon: Gift },
  { name: 'Keuangan', href: '/dashboard/reports/finance', icon: DollarSign },
];

// Asumsi: Halaman ini adalah Client Component atau Anda harus meneruskan pathname sebagai prop.
// Untuk kesederhanaan, kita asumsikan pathname akan digunakan di sini.
const AdminSidebar: React.FC = () => {
  // CATATAN: Jika Anda menggunakan App Router, Anda bisa mengaktifkan:
  // const pathname = usePathname(); 
  const activePath = '/dashboard'; // Placeholder

  return (
    <aside className="w-64 bg-slate-800 text-white flex flex-col fixed h-full overflow-y-auto z-40 shadow-xl">
      
      {/* Branding */}
      <div className="p-6 text-2xl font-bold border-b border-slate-700">
        TOKO OXI Admin
      </div>
      
      {/* Navigasi Utama */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            // Ganti activePath dengan logic real-time pathname
            className={`
              flex items-center gap-3 px-4 py-2 rounded transition-colors
              ${activePath === item.href 
                ? 'bg-indigo-600 font-semibold shadow-md' 
                : 'hover:bg-slate-700 text-gray-300'
              }
            `}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.name}</span>
          </Link>
        ))}

        {/* Notifikasi (Menu Khusus) */}
        <Link 
          href="/dashboard/notifications" 
          className="flex items-center gap-3 px-4 py-2 rounded hover:bg-slate-700 transition-colors bg-yellow-900/50 text-yellow-300 font-medium mt-4 border border-yellow-800"
        >
          <Bell className="w-5 h-5" />
          <span>Notifikasi Pengingat</span>
        </Link>
        
      </nav>
      
      {/* Footer Sidebar */}
      <div className="p-4 border-t border-slate-700 mt-auto space-y-2">
        <Link 
          href="/" 
          className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2 mb-2"
        >
          <span>&larr;</span> Kembali ke Toko
        </Link>
        
        <button className="flex items-center gap-3 px-4 py-2 rounded hover:bg-slate-700 text-red-400 w-full justify-start transition-colors">
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;