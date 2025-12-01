// components/admin/InventoryUnitModal.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { X, Save, Package } from 'lucide-react';

// Interface sederhana untuk unit inventaris
interface InventoryUnit {
    id: string;
    productRef: string;
    unitCode: string;
    condition: string;
    location: string;
    status: string;
    lastService: string;
}

interface InventoryUnitModalProps {
  isOpen: boolean;
  onClose: () => void;
  unit: InventoryUnit | null; // Null untuk mode Tambah
}

const InventoryUnitModal: React.FC<InventoryUnitModalProps> = ({ isOpen, onClose, unit }) => {
  const isEditMode = !!unit;
  const [formData, setFormData] = useState({
      productRef: '',
      unitCode: '',
      condition: 'Baik',
      location: '',
      status: 'Available',
      lastService: '',
  });

  // Sinkronkan form saat modal dibuka atau unit berubah (Edit Mode)
  useEffect(() => {
    // Defer state updates to avoid synchronous setState within an effect which can cause cascading renders.
    const t = setTimeout(() => {
      if (unit) {
        // Map only the form fields from the unit to match the formData shape
        setFormData({
          productRef: unit.productRef,
          unitCode: unit.unitCode,
          condition: unit.condition,
          location: unit.location,
          status: unit.status,
          lastService: unit.lastService,
        });
      } else {
        // Reset form untuk mode Tambah
        setFormData({
          productRef: '',
          unitCode: '',
          condition: 'Baik',
          location: '',
          status: 'Available',
          lastService: '',
        });
      }
    }, 0);

    return () => clearTimeout(t);
  }, [unit]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Di sini akan ada logika penyimpanan/update ke Firebase
    const action = isEditMode ? 'diperbarui' : 'ditambahkan';
    console.log(`Unit ${action}:`, formData);
    alert(`Unit Inventaris berhasil ${action}! (Mock)`);
    onClose();
  };

  return (
    // Backdrop Modal
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex justify-center items-center">
      
      {/* Container Modal */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl p-6 relative max-h-[90vh] overflow-y-auto">
        
        {/* Header Modal */}
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
            <Package className="w-6 h-6 text-indigo-600"/> 
            <span>{isEditMode ? `Edit Unit: ${unit?.unitCode}` : 'Tambah Unit Inventaris Baru'}</span>
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Form Input */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Kolom Kiri */}
          <div className="space-y-4">
            {/* Unit Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit Code / No. Seri (Wajib)</label>
              <input type="text" name="unitCode" value={formData.unitCode} onChange={handleChange} required
                className="w-full border-gray-300 rounded-lg p-2 text-gray-900 focus:ring-indigo-500" placeholder="Contoh: T001 / J015"
              />
            </div>

            {/* Produk Ref (Dropdown ke daftar produk) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Referensi Produk</label>
              {/* Di sini harusnya dropdown yang memanggil daftar produk utama */}
              <select name="productRef" value={formData.productRef} onChange={handleChange} required
                className="w-full border-gray-300 rounded-lg p-2 text-gray-900 focus:ring-indigo-500 bg-white"
              >
                <option value="">-- Pilih Produk --</option>
                <option value="TOGA-UH-L">Sewa Toga Unhas Size L</option>
                <option value="AKRILIK-S">Papan Akrilik S</option>
                <option value="JAS-W-S">Jas Wanita Size S</option>
              </select>
            </div>
            
            {/* Lokasi Stok */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi Stok</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} required
                className="w-full border-gray-300 rounded-lg p-2 text-gray-900 focus:ring-indigo-500" placeholder="Contoh: Rak 1A / Gudang 3"
              />
            </div>
          </div>

          {/* Kolom Kanan */}
          <div className="space-y-4">
            
            {/* Kondisi Unit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kondisi Fisik Unit</label>
              <select name="condition" value={formData.condition} onChange={handleChange} required
                className="w-full border-gray-300 rounded-lg p-2 text-gray-900 focus:ring-indigo-500 bg-white"
              >
                <option value="Baik">Baik</option>
                <option value="Baru">Baru</option>
                <option value="Minor Damage">Kerusakan Minor</option>
                <option value="Perlu Cuci">Perlu Cuci/Service</option>
                <option value="Rusak">Rusak Berat</option>
              </select>
            </div>

            {/* Status Ketersediaan */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status Ketersediaan</label>
              <select name="status" value={formData.status} onChange={handleChange} required
                className="w-full border-gray-300 rounded-lg p-2 text-gray-900 focus:ring-indigo-500 bg-white"
              >
                <option value="Available">Tersedia</option>
                <option value="Rented">Sedang Disewa</option>
                <option value="Maintenance">Perawatan / Pencucian</option>
                <option value="Sold">Terjual / Dihapus</option>
              </select>
            </div>
            
            {/* Tanggal Service Terakhir */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Service Terakhir</label>
              <input type="date" name="lastService" value={formData.lastService} onChange={handleChange}
                className="w-full border-gray-300 rounded-lg p-2 text-gray-900 focus:ring-indigo-500"
              />
            </div>
          </div>
          
          {/* Tombol Submit (Span 2 Kolom) */}
          <div className="md:col-span-2 flex justify-end pt-4">
            <button
              type="submit"
              className="bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2 shadow-md"
            >
              <Save className="w-5 h-5" />
              <span>{isEditMode ? 'Simpan Perubahan' : 'Tambahkan Unit'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InventoryUnitModal;