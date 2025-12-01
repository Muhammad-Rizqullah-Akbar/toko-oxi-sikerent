// app/admin/layout.tsx

import React from 'react';
import AdminSidebar from '../../../components/layout/AdminSidebar'; // Adjust path
import AdminHeader from '../../../components/layout/AdminHeader'; // Adjust path
import '../../globals.css'; // Pastikan CSS ter-load

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // CATATAN: Di sini Anda perlu menentukan pageTitle secara dinamis 
  // (misalnya menggunakan usePathname dan memetakan path ke judul)
  const dynamicPageTitle = "Dashboard Utama"; 

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      
      {/* 1. Sidebar (Fixed) */}
      <AdminSidebar />

      {/* 2. Konten Utama - diberi padding kiri (ml-64) */}
      <div className="flex-1 ml-64">
        
        {/* Header Admin */}
        <div className="p-4 md:p-8">
            <AdminHeader pageTitle={dynamicPageTitle} />
        </div>
        
        {/* Konten Halaman */}
        <main className="px-4 md:px-8 pb-8">
          {children}
        </main>
      </div>
    </div>
  );
}