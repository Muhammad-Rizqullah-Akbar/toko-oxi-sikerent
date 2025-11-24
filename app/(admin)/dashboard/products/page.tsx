// app/(admin)/dashboard/products/page.tsx
import { prisma } from '@/lib/prisma';
import { createProduct, deleteProduct } from '@/app/actions/product';
import Image from 'next/image';

export default async function ProductsPage() {
  // 1. FETCH DATA (Paralel biar cepat)
  const [products, categories] = await Promise.all([
    // Ambil Produk + Nama Kategorinya
    prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      include: { category: true } // JOIN tabel
    }),
    // Ambil Kategori untuk Dropdown
    prisma.category.findMany({
      orderBy: { name: 'asc' }
    })
  ]);

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Manajemen Produk</h1>

      {/* FORM TAMBAH PRODUK */}
      <div className="bg-white p-6 rounded-lg shadow mb-8 border border-gray-100">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Tambah Barang Baru</h2>
        
        <form action={createProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Kolom Kiri */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Barang</label>
              <input name="name" type="text" placeholder="Contoh: Kamera Canon DSLR" required className="w-full border rounded px-3 py-2" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kode Barang</label>
                  <input name="code" type="text" placeholder="BRG-00X" required className="w-full border rounded px-3 py-2" />
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stok Awal</label>
                  <input name="stock" type="number" placeholder="0" required className="w-full border rounded px-3 py-2" />
               </div>
            </div>
          </div>

          

          {/* Kolom Kanan */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Harga Sewa / Satuan (Rp)</label>
              <input name="price" type="number" placeholder="Contoh: 50000" required className="w-full border rounded px-3 py-2" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
              <select name="categoryId" required className="w-full border rounded px-3 py-2 bg-white">
                <option value="">-- Pilih Kategori --</option>
                {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Link Gambar (URL)</label>
              <input name="imageUrl" type="text" placeholder="https://..." className="w-full border rounded px-3 py-2" />
              <p className="text-xs text-gray-400 mt-1">*Bisa dikosongkan, nanti pakai placeholder</p>
            </div>
          </div>
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Produk</label>
            <textarea 
                name="description" 
                rows={4} 
                className="w-full border rounded px-3 py-2" 
                placeholder="Jelaskan detail produk..."
            ></textarea>
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Spesifikasi (Teknis)</label>
                <textarea 
                    name="specifications" 
                    rows={4} 
                    className="w-full border rounded px-3 py-2" 
                    placeholder="Contoh: Berat: 5kg, Warna: Hitam..."
                ></textarea>
            </div>
        </div>
          {/* Tombol Submit Full Width */}
          <div className="md:col-span-2 mt-2">
            <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 font-medium">
                Simpan Produk
            </button>
          </div>
        </form>
      </div>

      {/* TABEL DAFTAR PRODUK */}
      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
            <tr>
              <th className="px-6 py-3">Produk</th>
              <th className="px-6 py-3">Kategori</th>
              <th className="px-6 py-3">Harga</th>
              <th className="px-6 py-3 text-center">Stok</th>
              <th className="px-6 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    {/* Gambar Kecil */}
                    <div className="w-10 h-10 bg-gray-200 rounded overflow-hidden relative">
                        {product.imageUrl ? (
                            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="flex items-center justify-center h-full text-xs text-gray-500">No img</div>
                        )}
                    </div>
                    <div>
                        <div className="font-medium text-gray-900">{product.name}</div>
                        <div className="text-xs text-gray-500">{product.code}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                    <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                        {product.category.name}
                    </span>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-indigo-600">
                   {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(product.price)}
                </td>
                <td className="px-6 py-4 text-center">
                   {/* Logic Warna Stok */}
                   <span className={`text-sm font-bold ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                     {product.stock}
                   </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <form action={deleteProduct.bind(null, product.id)}>
                    <button className="text-red-500 hover:text-red-700 text-sm font-medium">Hapus</button>
                  </form>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
                <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-400">Belum ada produk.</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}