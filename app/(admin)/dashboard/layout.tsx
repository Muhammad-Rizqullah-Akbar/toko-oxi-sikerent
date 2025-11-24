import React from 'react';
import Link from 'next/link';
import '../../globals.css'; // Pastikan CSS ter-load

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      {/* Sidebar Sederhana */}
      <aside className="w-64 bg-slate-800 text-white flex flex-col fixed h-full overflow-y-auto">
        <div className="p-6 text-2xl font-bold border-b border-slate-700">
          Admin OXI
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/dashboard" className="block px-4 py-2 rounded hover:bg-slate-700 transition-colors">
            Overview
          </Link>
          <Link href="/dashboard/categories" className="block px-4 py-2 rounded hover:bg-slate-700 transition-colors">
            Manajemen Kategori
          </Link>
          <Link href="/dashboard/products" className="block px-4 py-2 rounded hover:bg-slate-700 transition-colors">
            Manajemen Produk
          </Link>
          
          {/* Menu Baru: Notifikasi */}
          <Link href="/dashboard/notifications" className="block px-4 py-2 rounded hover:bg-slate-700 transition-colors text-yellow-400 font-medium">
            🔔 Notifikasi Pengingat
          </Link>
        </nav>
        
        <div className="p-4 border-t border-slate-700 mt-auto">
          <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2">
            <span>&larr;</span> Kembali ke Toko
          </Link>
        </div>
      </aside>

      {/* Konten Utama - diberi margin kiri agar tidak tertutup sidebar fixed */}
      <main className="flex-1 p-8 ml-64">
        {children}
      </main>
    </div>
  );
}