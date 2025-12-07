'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { UnitCondition, UnitStatus } from '@prisma/client';

// 1. Ambil Semua Unit Inventaris
export async function getInventoryUnits() {
  try {
    return await prisma.inventoryUnit.findMany({
      include: {
        product: { select: { id: true, name: true, code: true, imageUrl: true } }
      },
      orderBy: { updatedAt: 'desc' }
    });
  } catch (error) {
    console.error("Gagal ambil inventaris:", error);
    return [];
  }
}

// 2. Ambil Daftar Produk (Untuk Dropdown Pilihan)
export async function getProductList() {
  try {
    return await prisma.product.findMany({
      select: { id: true, name: true, code: true },
      orderBy: { name: 'asc' }
    });
  } catch (error) {
    return [];
  }
}

// 3. Simpan Unit (Bisa Tambah Baru atau Update)
export async function saveInventoryUnit(data: any) {
  // Validasi sederhana
  if (!data.unitCode || !data.productId) {
    return { success: false, error: "Kode Unit dan Produk wajib diisi" };
  }

  try {
    if (data.id) {
      // --- MODE EDIT ---
      await prisma.inventoryUnit.update({
        where: { id: data.id },
        data: {
          unitCode: data.unitCode,
          productId: data.productId,
          condition: data.condition as UnitCondition,
          status: data.status as UnitStatus,
          location: data.location,
          // Handle tanggal (jika string kosong -> null)
          lastService: data.lastService ? new Date(data.lastService) : null,
        }
      });
    } else {
      // --- MODE TAMBAH BARU ---
      await prisma.inventoryUnit.create({
        data: {
          unitCode: data.unitCode,
          productId: data.productId,
          condition: data.condition as UnitCondition || 'BAIK',
          status: data.status as UnitStatus || 'AVAILABLE',
          location: data.location,
          lastService: data.lastService ? new Date(data.lastService) : null,
        }
      });
    }

    revalidatePath('/dashboard/inventories');
    return { success: true };
  } catch (error) {
    console.error("Error save unit:", error);
    return { success: false, error: "Gagal menyimpan (Cek kode unit duplikat)" };
  }
}

// 4. Hapus Unit
export async function deleteInventoryUnit(id: string) {
  try {
    await prisma.inventoryUnit.delete({ where: { id } });
    revalidatePath('/dashboard/inventories');
    return { success: true };
  } catch (error) {
    return { success: false, error: "Gagal menghapus unit" };
  }
}