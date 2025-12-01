'use server';

import { prisma } from '@/lib/prisma';

export async function getProductsByCategory(slug: string) {
  // Simulasi delay sedikit biar loading state kelihatan (opsional, bisa dihapus nanti)
  // await new Promise(resolve => setTimeout(resolve, 500)); 

  const products = await prisma.product.findMany({
    where: slug !== 'all' ? {
      category: {
        slug: slug
      }
    } : undefined,
    orderBy: { createdAt: 'desc' },
    include: { category: true }
  });

  return products;
}