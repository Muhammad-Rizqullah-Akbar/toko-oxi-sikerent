'use server';

import { prisma } from '@/lib/prisma';

// Tipe data untuk laporan keuangan ringkas
type FinancialSummary = {
  totalRevenue: number;
  totalOrders: number;
  pendingVerification: number;
  totalCustomers: number;
};

// Fungsi untuk mengambil data ringkasan dari DB
export async function getFinancialSummary(): Promise<FinancialSummary> {
  // 1. Hitung Total Revenue (hanya order yang sudah PAID)
  const revenueResult = await prisma.order.aggregate({
    _sum: {
      totalAmount: true,
    },
    where: {
      status: 'PAID',
    },
  });

  // 2. Hitung Total Orders
  const totalOrders = await prisma.order.count();
  
  // 3. Hitung Pending Verification
  const pendingVerification = await prisma.order.count({
    where: {
      status: 'PENDING',
    },
  });

  // 4. Hitung Total Customers
  const totalCustomers = await prisma.customer.count();

  const totalRevenue = revenueResult._sum.totalAmount || 0;

  return {
    totalRevenue,
    totalOrders,
    pendingVerification,
    totalCustomers,
  };
}

// Helper untuk format Rupiah
export function formatRupiah(amount: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}