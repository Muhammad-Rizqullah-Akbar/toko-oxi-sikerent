// app/actions/inventory.ts
'use server'

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// --- ACTION: TAMBAH KATEGORI ---
export async function createCategory(formData: FormData) {
  const name = formData.get('name') as string;
  
  // Buat slug otomatis dari nama (misal: "Alat Tulis" -> "alat-tulis")
  const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

  if (!name) return;

  try {
    await prisma.category.create({
      data: {
        name,
        slug,
      },
    });
  } catch (error) {
    console.error("Gagal buat kategori:", error);
    // Di real app, kita return error message
  }

  // Refresh halaman agar data baru muncul
  revalidatePath('/dashboard/categories');
}

// --- ACTION: HAPUS KATEGORI ---
export async function deleteCategory(id: string) {
  try {
    await prisma.category.delete({
      where: { id },
    });
    revalidatePath('/dashboard/categories');
  } catch (error) {
    console.error("Gagal hapus (mungkin masih ada produk?):", error);
  }
}