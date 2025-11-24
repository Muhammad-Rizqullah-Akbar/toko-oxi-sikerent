// app/(admin)/dashboard/products/page.tsx
import { prisma } from '@/lib/prisma';
import { createProduct, deleteProduct } from '@/app/actions/product';
import Image from 'next/image';

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      include: { category: true }
    }),
    prisma.category.findMany({
      orderBy: { name: 'asc' }
    })
  ]);

  // Class standar untuk semua input agar konsisten & gelap
  const inputClass = "w-full border border-gray-300 rounded px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white";
  const labelClass = "block text-sm font-bold text-gray-900 mb-1"; // Font tebal & hitam

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Manajemen Produk</h1>

      {/* FORM TAMBAH PRODUK */}
      <div className="bg-white p-6 rounded-lg shadow mb-8 border border-gray-200">
        <h2 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">Tambah Barang Baru</h2>
        
        <form action={createProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Kolom Kiri */}
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Nama Barang</label>
              <input name="name" type="text" placeholder="Contoh: Kamera Canon DSLR" required className={inputClass} />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className={labelClass}>Kode Barang</label>
                  <input name="code" type="text" placeholder="BRG-00X" required className={inputClass} />
               </div>
               <div>
                  <label className={labelClass}>Stok Awal</label>
                  <input name="stock" type="number" placeholder="0" required className={inputClass} />
               </div>
            </div>

            <div>
                <label className={labelClass}>Deskripsi Produk</label>
                <textarea 
                    name="description" 
                    rows={4} 
                    className={inputClass} 
                    placeholder="Jelaskan detail produk..."
                ></textarea>
            </div>
          </div>

          {/* Kolom Kanan */}
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Harga Sewa / Satuan (Rp)</label>
              <input name="price" type="number" placeholder="Contoh: 50000" required className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Kategori</label>
              <select name="categoryId" required className={inputClass}>
                <option value="" className="text-gray-500">-- Pilih Kategori --</option>
                {categories.map((cat) => (
                    <option key={cat.id} value={cat.id} className="text-gray-900">{cat.name}</option>
                ))}
              </select>
            </div>

             <div>
              <label className={labelClass}>Link Gambar (URL)</label>
              <input name="imageUrl" type="text" placeholder="https://..." className={inputClass} />
              <p className="text-xs text-gray-500 mt-1">*Bisa dikosongkan, nanti pakai placeholder</p>
            </div>

            <div>
                <label className={labelClass}>Spesifikasi (Teknis)</label>
                <textarea 
                    name="specifications" 
                    rows={4} 
                    className={inputClass} 
                    placeholder="Contoh: Berat: 5kg, Warna: Hitam..."
                ></textarea>
            </div>
          </div>

          {/* Tombol Submit Full Width */}
          <div className="md:col-span-2 mt-4 border-t pt-4">
            <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 font-bold text-lg shadow-md transition-transform hover:scale-[1.01]">
                Simpan Produk
            </button>
          </div>
        </form>
      </div>

      {/* TABEL DAFTAR PRODUK */}
      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-gray-700 text-sm uppercase font-bold border-b border-gray-200">
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
              <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    {/* Gambar Kecil */}
                    <div className="w-12 h-12 bg-gray-200 rounded overflow-hidden relative border border-gray-300 shrink-0">
                        {product.imageUrl ? (
                            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="flex items-center justify-center h-full text-xs text-gray-500 font-medium">No img</div>
                        )}
                    </div>
                    <div>
                        <div className="font-bold text-gray-900 text-sm">{product.name}</div>
                        <div className="text-xs text-gray-500 font-mono bg-gray-100 px-1 rounded inline-block mt-1">{product.code}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                    <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs px-2 py-1 rounded-full font-medium">
                        {product.category.name}
                    </span>
                </td>
                <td className="px-6 py-4 text-sm font-bold text-gray-900">
                   {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(product.price)}
                </td>
                <td className="px-6 py-4 text-center">
                   <span className={`text-sm font-bold px-2 py-1 rounded ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                     {product.stock}
                   </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <form action={deleteProduct.bind(null, product.id)}>
                    <button className="text-red-600 hover:text-red-800 text-sm font-semibold hover:underline">Hapus</button>
                  </form>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
                <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500 italic bg-gray-50">
                        Belum ada produk. Silakan tambah di atas.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}