// components/admin/EditMemberPointsModal.tsx

'use client';
import React, { useState, useEffect } from 'react';
import { X, Save, Gift, User } from 'lucide-react';

interface Member {
    id: number;
    name: string;
    email: string;
    totalPoints: number;
}

interface EditMemberPointsModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: Member | null; // Data member yang akan diedit
}

const EditMemberPointsModal: React.FC<EditMemberPointsModalProps> = ({ isOpen, onClose, member }) => {
  const [newPoints, setNewPoints] = useState(0);

  // Set nilai awal saat modal dibuka atau member berubah
  useEffect(() => {
    if (member) {
      // Defer the state update to avoid calling setState synchronously inside the effect,
      // which can trigger cascading renders.
      const id = setTimeout(() => {
        setNewPoints(member.totalPoints);
      }, 0);
      return () => clearTimeout(id);
    }
  }, [member]);

  if (!isOpen || !member) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Di sini Anda akan mengimplementasikan fungsi untuk menyimpan poin baru ke Firebase
    console.log(`Mengedit poin untuk ${member.name}. Poin baru: ${newPoints}`);
    alert(`Poin ${member.name} berhasil diperbarui (Mock)`);
    onClose(); 
  };

  return (
    // Backdrop Modal
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex justify-center items-center">
      
      {/* Container Modal */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 relative">
        
        {/* Header Modal */}
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
            <User className="w-5 h-5 text-indigo-600"/> 
            <span>Edit Poin Member</span>
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Detail Member */}
        <div className="mb-4 bg-gray-50 p-3 rounded-lg border">
            <p className='text-sm font-semibold'>{member.name}</p>
            <p className='text-xs text-gray-500'>{member.email}</p>
            <p className='text-xs mt-1'>Poin Saat Ini: <span className='font-bold text-indigo-600'>{member.totalPoints.toLocaleString()}</span></p>
        </div>

        {/* Form Input */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Total Poin Baru
            </label>
            <input
              type="number"
              value={newPoints}
              onChange={(e) => setNewPoints(Number(e.target.value))}
              className="w-full border-gray-300 rounded-lg p-2 text-gray-900 focus:ring-indigo-500"
              placeholder="Masukkan jumlah poin baru"
              min="0"
              required
            />
          </div>

          {/* Tombol Simpan */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2 shadow-md"
            >
              <Save className="w-5 h-5" />
              <span>Simpan Poin</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMemberPointsModal;