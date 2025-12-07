// app/(public)/profile/orders/page.tsx

import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-server';
import { prisma } from '@/lib/prisma';
import { Package, ArrowLeft, FileText, Calendar } from 'lucide-react';
import Link from 'next/link';

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect('/auth/login?callbackUrl=/profile/orders');
  }

  const customer = await prisma.customer.findUnique({
    where: { id: session.user.id }
  });

  if (!customer) {
    redirect('/auth/login');
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/profile"
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Pesanan Saya</h1>
              <p className="text-slate-600 mt-2">
                Kelola dan lacak pesanan Anda
              </p>
            </div>
          </div>
        </div>

        {/* Empty State */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="text-center py-12">
            <Package className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-slate-800 mb-3">
              Belum Ada Pesanan
            </h3>
            <p className="text-slate-600 max-w-md mx-auto mb-8">
              Anda belum melakukan pemesanan. Mulailah dengan menjelajahi katalog produk kami dan lakukan checkout.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                className="bg-indigo-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors inline-flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Lihat Katalog Produk
              </Link>
              <Link
                href="/cart"
                className="border border-gray-300 text-slate-700 font-medium py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors inline-flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Lihat Keranjang
              </Link>
            </div>

            {/* Development Info */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 max-w-2xl mx-auto">
                <h4 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
                  <span>🛠️</span>
                  Fitur Dalam Pengembangan
                </h4>
                <p className="text-amber-700 text-sm mb-4">
                  Halaman ini akan menampilkan riwayat pesanan Anda setelah:
                </p>
                <ul className="text-sm text-amber-700 space-y-2 list-disc pl-5">
                  <li>Sistem cart terintegrasi dengan user account</li>
                  <li>Checkout system dengan payment gateway</li>
                  <li>Order management system</li>
                </ul>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-amber-600">
                    Estimated completion: Phase 2
                  </span>
                  <Link
                    href="/profile"
                    className="text-sm text-amber-700 hover:text-amber-800 font-medium"
                  >
                    Kembali ke Dashboard →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}