// components/admin/RewardPolicyModal.tsx

'use client';

import React, { useState } from 'react';
import { X, Save, Settings } from 'lucide-react';

interface Policy {
  earningRate: number; 
  redemptionRate: number;
  minRedeem: number;
}

interface RewardPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPolicy: Policy;
  onPolicySave: (policy: Policy) => void; // Handler untuk menyimpan data
}

const RewardPolicyModal: React.FC<RewardPolicyModalProps> = ({ isOpen, onClose, currentPolicy, onPolicySave }) => {
  // State lokal untuk form input
  const [earningRate, setEarningRate] = useState(currentPolicy.earningRate);
  const [redemptionRate, setRedemptionRate] = useState(currentPolicy.redemptionRate);
  const [minRedeem, setMinRedeem] = useState(currentPolicy.minRedeem);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newPolicy = { earningRate, redemptionRate, minRedeem };
    onPolicySave(newPolicy); // Meneruskan data ke parent (PointRewardPage)
    
    // Di sini seharusnya ada logika penyimpanan ke Firebase
    alert('Kebijakan Reward berhasil diperbarui (Mock)');
  };

  return (
    // Backdrop Modal
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex justify-center items-center">
      
      {/* Container Modal */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 relative">
        
        {/* Header Modal */}
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
            <Settings className="w-6 h-6 text-indigo-600"/> 
            <span>Kebijakan Point Reward</span>
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Form Kebijakan */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* 1. Rate Perolehan Poin */}
          <div className="border p-4 rounded-lg bg-indigo-50">
            <label className="block text-sm font-medium text-indigo-700 mb-2">
              Rate Perolehan Poin (Poin per Rp 1.000)
            </label>
            <p className='text-xs text-gray-600 mb-3'>
                Tentukan berapa poin yang didapatkan member untuk setiap Rp 1.000 pembelanjaan.
            </p>
            <input
              type="number"
              value={earningRate}
              onChange={(e) => setEarningRate(Number(e.target.value))}
              className="w-full border-indigo-300 rounded-lg p-2 text-gray-900 focus:ring-indigo-500"
              placeholder="Contoh: 1 (Berarti 1 Poin per Rp 1.000)"
              min="0.1"
              step="0.1"
              required
            />
          </div>

          {/* 2. Rate Penukaran Poin */}
          <div className="border p-4 rounded-lg bg-green-50">
            <label className="block text-sm font-medium text-green-700 mb-2">
              Nilai Tukar Poin (Rupiah per 100 Poin)
            </label>
            <p className='text-xs text-gray-600 mb-3'>
                Tentukan berapa Rupiah nilai 100 poin.
            </p>
            <input
              type="number"
              value={redemptionRate}
              onChange={(e) => setRedemptionRate(Number(e.target.value))}
              className="w-full border-green-300 rounded-lg p-2 text-gray-900 focus:ring-green-500"
              placeholder="Contoh: 10000 (Berarti 100 Poin = Rp 10.000)"
              min="100"
              step="100"
              required
            />
          </div>

          {/* 3. Minimum Penukaran */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Poin untuk Penukaran
            </label>
            <input
              type="number"
              value={minRedeem}
              onChange={(e) => setMinRedeem(Number(e.target.value))}
              className="w-full border-gray-300 rounded-lg p-2 text-gray-900 focus:ring-indigo-500"
              placeholder="Contoh: 500 (Poin)"
              min="100"
              step="100"
              required
            />
          </div>

          {/* Tombol Simpan */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2 shadow-md"
            >
              <Save className="w-5 h-5" />
              <span>Simpan Kebijakan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RewardPolicyModal;