// app/(admin)/dashboard/layout.tsx
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
      <aside className="w-64 bg-slate-800 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold border-b border-slate-700">
          Admin OXI
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/dashboard" className="block px-4 py-2 rounded hover:bg-slate-700">
            Overview
          </Link>
          <Link href="/dashboard/categories" className="block px-4 py-2 rounded hover:bg-slate-700">
            Manajemen Kategori
          </Link>
          <Link href="/dashboard/products" className="block px-4 py-2 rounded hover:bg-slate-700">
            Manajemen Produk
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-700">
          <Link href="/" className="text-sm text-gray-400 hover:text-white">
            &larr; Kembali ke Toko
          </Link>
        </div>
      </aside>

      {/* Konten Utama */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}