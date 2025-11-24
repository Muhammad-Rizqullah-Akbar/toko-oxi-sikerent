// app/actions/product.ts
'use server'

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// --- ACTION: TAMBAH PRODUK ---
export async function createProduct(formData: FormData) {
  // 1. Ambil data wajib dari form
  const name = formData.get('name') as string;
  const code = formData.get('code') as string;
  const price = Number(formData.get('price'));
  const stock = Number(formData.get('stock'));
  const categoryId = formData.get('categoryId') as string;
  const imageUrl = formData.get('imageUrl') as string;

  // 2. Ambil data tambahan (Deskripsi & Spesifikasi)
  // Kita ambil sebagai string
  const description = formData.get('description') as string;
  const specifications = formData.get('specifications') as string;
  
  // 3. Validasi input wajib
  if (!name || !code || !categoryId) {
    // Idealnya return error message ke UI, tapi untuk sekarang return saja
    return; 
  }

  // 4. Buat Slug otomatis (misal: "Kamera Canon" -> "kamera-canon-xy12")
  // Tambah random string di belakang biar unik dan tidak error kalau nama sama
  const randomSuffix = Math.random().toString(36).substring(7);
  const slug = name.toLowerCase()
    .replace(/[^\w\s-]/g, '') // Hapus karakter aneh
    .replace(/\s+/g, '-')     // Ganti spasi jadi strip
    + '-' + randomSuffix;

  try {
    // 5. Simpan ke Database via Prisma
    await prisma.product.create({
      data: {
        name,
        code,
        slug,
        price,
        stock,
        categoryId, // Relasi ke Kategori
        
        // Logika: Jika string kosong (""), simpan sebagai null agar hemat DB
        imageUrl: imageUrl || null, 
        description: description || null,
      },
    });

    // 6. Refresh halaman agar data baru muncul
    revalidatePath('/dashboard/products'); // Refresh Admin
    revalidatePath('/'); // Refresh Homepage Toko
    
  } catch (error) {
    console.error("Gagal tambah produk:", error);
    // Di real app, Anda bisa throw error agar muncul notif gagal di UI
  }
}

// --- ACTION: HAPUS PRODUK ---
export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({
      where: { id },
    });
    
    // Refresh halaman setelah hapus
    revalidatePath('/dashboard/products');
    revalidatePath('/'); 
    
  } catch (error) {
    console.error("Gagal hapus produk:", error);
  }
}