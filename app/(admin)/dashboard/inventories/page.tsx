'use client';

import React, { useState, useEffect } from 'react';
import { Package, Search, Plus, Trash2, Edit2, Loader2, Save, X, RefreshCcw, MapPin } from 'lucide-react';
import { getInventoryUnits, getProductList, saveInventoryUnit, deleteInventoryUnit } from '@/app/actions/inventory';

// --- KOMPONEN HALAMAN UTAMA ---
export default function InventoryPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [units, setUnits] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]); // Untuk dropdown
  const [filteredUnits, setFilteredUnits] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // State Modal Inline
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<any>(null);

  // 1. Fetch Data Awal
  const loadData = async () => {
    setIsLoading(true);
    const [unitsData, productsData] = await Promise.all([
      getInventoryUnits(),
      getProductList()
    ]);
    setUnits(unitsData);
    setFilteredUnits(unitsData);
    setProducts(productsData);
    setIsLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  // 2. Filter Pencarian
  useEffect(() => {
    const lower = searchTerm.toLowerCase();
    const filtered = units.filter(u => 
      u.unitCode.toLowerCase().includes(lower) || 
      u.product.name.toLowerCase().includes(lower) ||
      (u.location && u.location.toLowerCase().includes(lower))
    );
    setFilteredUnits(filtered);
  }, [searchTerm, units]);

  // 3. Handlers
  const handleDelete = async (id: string) => {
    if(!confirm("Hapus unit ini secara permanen?")) return;
    const res = await deleteInventoryUnit(id);
    if(res.success) loadData();
    else alert(res.error);
  };

  const handleSaveCallback = async (formData: any) => {
    // Panggil Server Action
    const res = await saveInventoryUnit(formData);
    if (res.success) {
      loadData(); // Refresh tabel
      setIsModalOpen(false); // Tutup modal
    } else {
      alert(res.error);
    }
  };

  const openAdd = () => { setSelectedUnit(null); setIsModalOpen(true); };
  const openEdit = (unit: any) => { setSelectedUnit(unit); setIsModalOpen(true); };

  // Helper Warna Status
  const getStatusColor = (s: string) => {
    if(s === 'AVAILABLE') return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if(s === 'RENTED') return 'bg-orange-100 text-orange-800 border-orange-200';
    if(s === 'MAINTENANCE') return 'bg-red-100 text-red-800 border-red-200';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="max-w-7xl mx-auto">
      
      {/* Header & Tools */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Package className="text-indigo-600"/> Manajemen Inventaris
          </h1>
          <p className="text-gray-500 text-sm mt-1">Total {units.length} unit fisik tercatat.</p>
        </div>
        <button onClick={openAdd} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg font-bold shadow-md flex items-center gap-2 transition-all">
          <Plus size={18} /> Unit Baru
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Cari Kode Unit, Nama Barang..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button onClick={loadData} className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600" title="Refresh">
          <RefreshCcw size={20} />
        </button>
      </div>

      {/* Tabel Data */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Kode Unit</th>
                <th className="px-6 py-4">Produk</th>
                <th className="px-6 py-4">Kondisi / Lokasi</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {isLoading ? (
                <tr><td colSpan={5} className="py-12 text-center text-gray-500"><Loader2 className="animate-spin inline mr-2"/> Memuat Data...</td></tr>
              ) : filteredUnits.length === 0 ? (
                <tr><td colSpan={5} className="py-12 text-center text-gray-500 italic">Tidak ada data ditemukan.</td></tr>
              ) : (
                filteredUnits.map((unit) => (
                  <tr key={unit.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-1 rounded border border-indigo-100">
                        {unit.unitCode}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-800">{unit.product.name}</div>
                      <div className="text-xs text-gray-500">{unit.product.code}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-700 font-medium mb-1">{unit.condition.replace('_',' ')}</div>
                      {unit.location && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <MapPin size={12}/> {unit.location}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(unit.status)}`}>
                        {unit.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEdit(unit)} className="p-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"><Edit2 size={16}/></button>
                        <button onClick={() => handleDelete(unit.id)} className="p-2 bg-red-50 text-red-600 rounded hover:bg-red-100"><Trash2 size={16}/></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL INLINE (Form Add/Edit) --- */}
      {isModalOpen && (
        <InventoryModal 
          unit={selectedUnit} 
          products={products}
          onClose={() => setIsModalOpen(false)} 
          onSave={handleSaveCallback} 
        />
      )}
    </div>
  );
}

// --- KOMPONEN MODAL (Di dalam file yang sama agar ringkas) ---
function InventoryModal({ unit, products, onClose, onSave }: any) {
  const isEdit = !!unit;
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    id: unit?.id || '',
    unitCode: unit?.unitCode || '',
    productId: unit?.productId || '',
    condition: unit?.condition || 'BAIK',
    status: unit?.status || 'AVAILABLE',
    location: unit?.location || '',
    lastService: unit?.lastService ? new Date(unit.lastService).toISOString().split('T')[0] : ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await onSave(form);
    setIsSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            {isEdit ? <Edit2 size={18}/> : <Plus size={18}/>}
            {isEdit ? 'Edit Unit Inventaris' : 'Tambah Unit Baru'}
          </h3>
          <button onClick={onClose}><X size={20} className="text-slate-400 hover:text-slate-600"/></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 gap-4">
          
          {/* Kode Unit */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Kode Unit (Serial Number)</label>
            <input 
              required type="text" 
              placeholder="Contoh: CAM-001"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none font-mono"
              value={form.unitCode}
              onChange={e => setForm({...form, unitCode: e.target.value})}
            />
          </div>

          {/* Produk (Dropdown) */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Produk Referensi</label>
            <select 
              required
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
              value={form.productId}
              onChange={e => setForm({...form, productId: e.target.value})}
            >
              <option value="">-- Pilih Produk --</option>
              {products.map((p: any) => (
                <option key={p.id} value={p.id}>{p.code} - {p.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Kondisi */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Kondisi</label>
              <select 
                className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none bg-white"
                value={form.condition}
                onChange={e => setForm({...form, condition: e.target.value})}
              >
                <option value="BAIK">Baik</option>
                <option value="BARU">Baru</option>
                <option value="MINOR_DAMAGE">Rusak Ringan</option>
                <option value="PERLU_SERVICE">Perlu Service</option>
                <option value="RUSAK_BERAT">Rusak Berat</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Status Ketersediaan</label>
              <select 
                className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none bg-white"
                value={form.status}
                onChange={e => setForm({...form, status: e.target.value})}
              >
                <option value="AVAILABLE">Tersedia</option>
                <option value="RENTED">Disewa</option>
                <option value="MAINTENANCE">Perawatan</option>
                <option value="SOLD">Terjual/Hilang</option>
              </select>
            </div>
          </div>

          {/* Lokasi */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Lokasi Penyimpanan</label>
            <input 
              type="text" 
              placeholder="Contoh: Rak A, Gudang 2"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              value={form.location}
              onChange={e => setForm({...form, location: e.target.value})}
            />
          </div>

          {/* Tanggal Service */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Service Terakhir (Opsional)</label>
            <input 
              type="date" 
              className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none"
              value={form.lastService}
              onChange={e => setForm({...form, lastService: e.target.value})}
            />
          </div>

          <div className="flex gap-3 mt-4 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border rounded-lg font-bold text-slate-600 hover:bg-slate-50">Batal</button>
            <button 
              type="submit" disabled={isSaving}
              className="flex-[2] py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold flex justify-center items-center gap-2 disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="animate-spin w-5 h-5"/> : <Save className="w-5 h-5"/>}
              Simpan
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}