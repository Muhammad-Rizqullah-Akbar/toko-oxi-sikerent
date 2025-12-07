'use server';

import { prisma } from '@/lib/prisma';

export async function getFinanceData() {
  try {
    // 1. Ambil Semua Order yang VALID (Paid/Selesai/Disewa)
    // Kita asumsikan status PAID, DIPROSES, DISEWA, SELESAI, TERLAMBAT sudah ada uang masuk.
    const validOrders = await prisma.order.findMany({
      where: {
        status: { in: ['PAID', 'DIPROSES', 'DISEWA', 'SELESAI', 'TERLAMBAT'] }
      },
      include: {
        rentalOrders: {
          include: { items: { include: { product: true } } }
        },
        printOrders: true
      },
      orderBy: { createdAt: 'desc' }
    });

    // 2. Hitung Total Revenue
    const totalRevenue = validOrders.reduce((acc, order) => acc + Number(order.totalAmount), 0);

    // 3. Hitung Potensi Pendapatan (Status PENDING)
    const pendingOrders = await prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { status: 'PENDING' }
    });
    const potentialRevenue = Number(pendingOrders._sum.totalAmount || 0);

    // 4. Analisis Produk Terlaris (Manual Aggregation karena struktur relasi complex)
    const productStats: Record<string, { name: string; count: number; revenue: number }> = {};

    validOrders.forEach(order => {
      // Hitung dari Rental
      order.rentalOrders.forEach(rental => {
        rental.items.forEach(item => {
          const pid = item.productId;
          if (!productStats[pid]) {
            productStats[pid] = { 
                name: item.product.name, 
                count: 0, 
                revenue: 0 
            };
          }
          productStats[pid].count += item.quantity;
          productStats[pid].revenue += Number(item.priceAtRental) * item.quantity;
        });
      });

      // Hitung dari Printing (Opsional, jika PrintOrder dianggap 'produk')
      order.printOrders.forEach(print => {
        const key = `PRINT-${print.serviceType}`;
        if (!productStats[key]) {
            productStats[key] = { name: `Jasa Cetak: ${print.serviceType}`, count: 0, revenue: 0 };
        }
        productStats[key].count += print.copies;
        productStats[key].revenue += Number(print.totalPrice);
      });
    });

    // Urutkan Top 5 Produk
    const topProducts = Object.values(productStats)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // 5. Grafik Pendapatan Bulanan (Sederhana)
    const monthlyStats: Record<string, number> = {};
    validOrders.forEach(order => {
      const month = new Date(order.createdAt).toLocaleString('id-ID', { month: 'short' });
      monthlyStats[month] = (monthlyStats[month] || 0) + Number(order.totalAmount);
    });
    
    // Format ke Array untuk grafik
    const chartData = Object.keys(monthlyStats).map(key => ({
      name: key,
      value: monthlyStats[key]
    }));

    return {
      totalRevenue,
      potentialRevenue,
      totalOrders: validOrders.length,
      topProducts,
      chartData
    };

  } catch (error) {
    console.error("Gagal ambil data keuangan:", error);
    return {
      totalRevenue: 0,
      potentialRevenue: 0,
      totalOrders: 0,
      topProducts: [],
      chartData: []
    };
  }
}