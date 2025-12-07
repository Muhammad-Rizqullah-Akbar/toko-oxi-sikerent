'use server'

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// --- 1. AMBIL DATA MEMBER ---
export async function getMembersForReward() {
  try {
    const members = await prisma.customer.findMany({
      orderBy: { totalPoints: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        whatsapp: true, // Tambahan field
        totalPoints: true,
        isActive: true, // Pastikan field ini ada di schema prisma Anda
      }
    });
    return members;
  } catch (error) {
    console.error("Database Error:", error);
    return [];
  }
}

// --- 2. UPDATE POIN MEMBER ---
export async function updateMemberPoints(customerId: string, newPoints: number) {
  if (!customerId) return { success: false, error: "ID Customer missing" };

  try {
    const updated = await prisma.customer.update({
      where: { id: customerId },
      data: { 
        totalPoints: Number(newPoints),
        updatedAt: new Date()
      }
    });
    
    // Refresh halaman admin agar data terbaru muncul
    revalidatePath('/dashboard/point-reward');
    return { success: true, data: updated };
  } catch (error) {
    console.error("Gagal update poin:", error);
    return { success: false, error: "Gagal update database" };
  }
}

// --- 3. GET & UPDATE POLICY (Opsional untuk fitur sebelah) ---
export async function getRewardPolicy() {
  let policy = await prisma.rewardPolicy.findFirst({ where: { isActive: true } });
  if (!policy) {
    // Default jika belum ada
    policy = await prisma.rewardPolicy.create({
      data: { earningRate: 1, redemptionRate: 10000, minRedeem: 500, isActive: true }
    });
  }
  return policy;
}

export async function updateRewardPolicy(data: { earningRate: number; redemptionRate: number; minRedeem: number }) {
  const policy = await prisma.rewardPolicy.findFirst({ where: { isActive: true } });
  if (policy) {
    await prisma.rewardPolicy.update({
      where: { id: policy.id },
      data: {
        earningRate: Number(data.earningRate),
        redemptionRate: Number(data.redemptionRate),
        minRedeem: Number(data.minRedeem),
      }
    });
  }
  revalidatePath('/dashboard/point-reward');
  return { success: true };
}