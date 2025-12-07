'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, Save, Loader2 } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  whatsapp: string;
  email: string | null;
}

export default function EditProfileForm({ customer }: { customer: Customer }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: customer.name,
    email: customer.email || '',
    whatsapp: customer.whatsapp,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.whatsapp // API route Anda pakai key 'phone'
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Gagal update profil');

      alert('Profil berhasil diperbarui!');
      router.refresh();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Nama Lengkap</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="email"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
              placeholder="email@contoh.com"
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-slate-700 mb-2">WhatsApp</label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              required
              value={formData.whatsapp}
              onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-mono"
            />
          </div>
          <p className="text-xs text-slate-500 mt-2 ml-1">Pastikan nomor aktif untuk notifikasi pesanan.</p>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-slate-100">
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center gap-2 disabled:opacity-70"
        >
          {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5" />}
          Simpan Perubahan
        </button>
      </div>
    </form>
  );
}