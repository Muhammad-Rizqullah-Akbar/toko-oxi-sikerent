'use client';

import React, { useState, useEffect } from 'react';
import { X, Save, Package, Loader2 } from 'lucide-react';
import { getProductListForDropdown } from '@/app/actions/admin/inventory'; // Import action

// Tipe data sesuaikan
interface InventoryUnit {
    id?: string;
    productId: string;
    unitCode: string;
    condition: string;
    location: string;
    status: string;
    lastService: string | null;
}

interface InventoryUnitModalProps {
  isOpen: boolean;
  onClose: () => void;
  unit: InventoryUnit | null; // Null jika mode Tambah
  onSave: (data: any) => Promise<void>;
}

export default function InventoryUnitModal({ isOpen, onClose, unit, onSave }: InventoryUnitModalProps) {
  const isEditMode = !!unit;
  const [isSaving, setIsSaving] = useState(false);
  const [products, setProducts] = useState<{id: string, name: string, code: string}[]>([]);
  
  const [formData, setFormData] = useState({
      productId: '',
      unitCode: '',
      condition: 'BAIK',
      location: '',
      status: 'AVAILABLE',
      lastService: '',
  });

  // 1. Fetch Produk untuk Dropdown saat modal pertama kali diload
  useEffect(() => {
    getProductListForDropdown().then(setProducts);
  }, []);

  // 2. Isi form jika Edit Mode
  useEffect(() => {
    if (unit) {
      setFormData({
        productId: unit.productId,
        unitCode: unit.unitCode,
        condition: unit.condition,
        location: unit.location || '',
        status: unit.status,
        lastService: unit.lastService ? new Date(unit.lastService).toISOString().split('T')[0] : '',
      });
    } else {
      // Reset form
      setFormData({
        productId: '',
        unitCode: '',
        condition: 'BAIK',
        location: '',
        status: 'AVAILABLE',
        lastService: '',
      });
    }
  }, [unit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Gabungkan ID jika edit mode
    const payload = isEditMode ? { ...formData, id: unit?.id } : formData;
    
    await onSave(payload);
    setIsSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
        
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Package className="w-6 h-6 text-indigo-600"/> 
            <span>{isEditMode ? `Edit Unit: ${unit?.unitCode}` : 'Tambah Unit Baru'}</span>
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* Unit Code */}
          <div className="md:col-span-1">
            <label className="block text-sm font-bold text-gray-700 mb-1">Unit Code (Serial Number)</label>
            <input 
              type="text" name="unitCode" value={formData.unitCode} onChange={handleChange} required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none" 
              placeholder="Cth: CAM-001"
            />
          </div>

          {/* Produk Ref */}
          <div className="md:col-span-1">
            <label className="block text-sm font-bold text-gray-700 mb-1">Produk</label>
            <select 
              name="productId" value={formData.productId} onChange={handleChange} required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
            >
              <option value="">-- Pilih Produk --</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.code} - {p.name}</option>
              ))}
            </select>
          </div>
          
          {/* Lokasi */}
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-1">Lokasi Penyimpanan</label>
            <input 
              type="text" name="location" value={formData.location} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none" 
              placeholder="Cth: Rak A, Lemari 2"
            />
          </div>

          {/* Kondisi */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Kondisi</label>
            <select name="condition" value={formData.condition} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white">
              <option value="BAIK">Baik</option>
              <option value="BARU">Baru</option>
              <option value="MINOR_DAMAGE">Rusak Ringan</option>
              <option value="PERLU_SERVICE">Perlu Service</option>
              <option value="RUSAK_BERAT">Rusak Berat</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white">
              <option value="AVAILABLE">Tersedia</option>
              <option value="RENTED">Sedang Disewa</option>
              <option value="MAINTENANCE">Dalam Perawatan</option>
              <option value="SOLD">Terjual / Hilang</option>
            </select>
          </div>
          
          {/* Tanggal Service */}
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-1">Service Terakhir</label>
            <input 
              type="date" name="lastService" value={formData.lastService} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          
          {/* Footer Buttons */}
          <div className="md:col-span-2 flex justify-end gap-3 mt-4 border-t pt-4">
            <button
              type="button" onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 font-bold"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="bg-indigo-600 text-white font-bold px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="animate-spin w-4 h-4"/> : <Save className="w-4 h-4" />}
              {isEditMode ? 'Simpan Perubahan' : 'Tambah Unit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}