// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    // PENTING: Aplikasi tetap pakai DATABASE_URL (Pooling/Port 6543)
    // Ini menimpa settingan yang ada di prisma.config.ts
    datasourceUrl: process.env.DATABASE_URL, 
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;