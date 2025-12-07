'use client';

import React, { useState, useEffect } from 'react';
import { X, Save, Gift, Loader2, AlertCircle } from 'lucide-react';

type Member = {
  id: string;
  name: string;
  totalPoints: number;
};

interface EditMemberPointsModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: Member | null;
  onSave: (newPoints: number) => Promise<void>;
}

export default function EditMemberPointsModal({ 
  isOpen, 
  onClose, 
  member, 
  onSave 
}: EditMemberPointsModalProps) {
  const [mode, setMode] = useState<'add' | 'set'>('add'); // 'add' (tambah/kurang) atau 'set' (atur ulang)
  const [inputValue, setInputValue] = useState<string>(''); // String agar bisa kosong saat diketik
  const [isSaving, setIsSaving] = useState(false);

  // Reset form saat modal dibuka
  useEffect(() => {
    if (isOpen && member) {
      setMode('add');
      setInputValue('');
    }
  }, [isOpen, member]);

  if (!isOpen || !member) return null;

  // Hitung poin akhir untuk preview
  const numericInput = parseInt(inputValue) || 0;
  const finalPoints = mode === 'set' 
    ? numericInput 
    : member.totalPoints + numericInput;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (finalPoints < 0) {
      alert("Poin akhir tidak boleh kurang dari 0");
      return;
    }

    setIsSaving(true);
    try {
      await onSave(finalPoints);
      // Jangan lupa onClose dipanggil oleh parent setelah sukses
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Gift className="w-5 h-5 text-indigo-600" />
            Edit Poin Member
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Info Member */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
            <p className="text-xs font-bold text-blue-600 uppercase mb-1">Member Terpilih</p>
            <div className="flex justify-between items-end">
                <div>
                    <p className="text-lg font-bold text-slate-800">{member.name}</p>
                    <p className="text-sm text-slate-500">Poin Saat Ini:</p>
                </div>
                <p className="text-2xl font-mono font-bold text-indigo-600">{member.totalPoints.toLocaleString()}</p>
            </div>
          </div>

          {/* Mode Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-lg mb-4">
            <button
                type="button"
                onClick={() => { setMode('add'); setInputValue(''); }}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${mode === 'add' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
                Tambah / Kurang
            </button>
            <button
                type="button"
                onClick={() => { setMode('set'); setInputValue(member.totalPoints.toString()); }}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${mode === 'set' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
                Atur Manual
            </button>
          </div>

          {/* Input Area */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-700 mb-2">
                {mode === 'add' ? 'Nomor Penambahan (Gunakan - untuk kurang)' : 'Set Jumlah Poin Baru'}
            </label>
            <div className="relative">
                <input
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-full pl-4 pr-12 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-0 text-lg font-mono font-bold text-slate-800 outline-none transition-all"
                    placeholder={mode === 'add' ? "Contoh: 500 atau -200" : "0"}
                    autoFocus
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">PTS</span>
            </div>
            
            {/* Preview Calculation */}
            <div className="mt-3 flex justify-between items-center text-sm border-t border-slate-100 pt-3">
                <span className="text-slate-500">Hasil Akhir:</span>
                <span className={`font-bold ${finalPoints < 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {finalPoints.toLocaleString()} Poin
                </span>
            </div>
            
            {finalPoints < 0 && (
                <div className="mt-2 flex items-center gap-2 text-red-600 text-xs bg-red-50 p-2 rounded">
                    <AlertCircle size={14} /> Poin tidak bisa negatif.
                </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSaving || finalPoints < 0}
              className="flex-[2] py-3 px-4 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSaving ? <Loader2 className="animate-spin w-5 h-5"/> : <Save className="w-5 h-5"/>}
              {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}