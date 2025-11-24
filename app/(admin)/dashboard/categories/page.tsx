// app/(admin)/dashboard/categories/page.tsx
import { prisma } from '@/lib/prisma';
import { createCategory, deleteCategory } from '@/app/actions/inventory';

export default async function CategoriesPage() {
  // Ambil data kategori dari database
  const categories = await prisma.category.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { products: true } } } // Hitung jumlah produk per kategori
  });

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Manajemen Kategori</h1>

      {/* FORM TAMBAH KATEGORI */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Tambah Kategori Baru</h2>
        <form action={createCategory} className="flex gap-4">
          <input
            type="text"
            name="name"
            placeholder="Nama Kategori (misal: Digital Printing)"
            className="flex-1 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
            required
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition-colors font-medium"
          >
            Simpan
          </button>
        </form>
      </div>

      {/* TABEL DAFTAR KATEGORI */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Nama Kategori</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Slug</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-center">Jumlah Produk</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-800">{cat.name}</td>
                <td className="px-6 py-4 text-gray-500 italic">{cat.slug}</td>
                <td className="px-6 py-4 text-center">
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-bold">
                    {cat._count.products} Item
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <form action={deleteCategory.bind(null, cat.id)}>
                    <button className="text-red-500 hover:text-red-700 text-sm font-medium">
                      Hapus
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                  Belum ada kategori. Silakan tambah di atas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}