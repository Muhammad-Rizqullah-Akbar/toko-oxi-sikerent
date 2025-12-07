'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Calendar, CheckCircle2, Clock, Loader2, Send } from 'lucide-react';
import { getMonitoringData, sendCustomerNotification } from '@/app/actions/notification';

export default function MonitoringPage() {
  const [activeRentals, setActiveRentals] = useState<any[]>([]);
  const [completedRentals, setCompletedRentals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingId, setSendingId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await getMonitoringData();
    setActiveRentals(data.activeRentals);
    setCompletedRentals(data.completedRentals);
    setLoading(false);
  };

  const handleSendNotification = async (
    customerId: string, 
    type: 'REMINDER' | 'THANK_YOU', 
    name: string, 
    date?: string
  ) => {
    setSendingId(customerId); // Tampilkan loading di tombol
    
    // Format tanggal deadline jika ada
    const dateStr = date ? new Date(date).toLocaleDateString('id-ID', {day: 'numeric', month: 'long'}) : '';

    const res = await sendCustomerNotification(customerId, type, { name, date: dateStr });

    if (res.success) {
      alert(`Notifikasi "${type}" berhasil dikirim ke ${name}`);
    } else {
      alert(`Gagal: ${res.error}`);
    }
    setSendingId(null);
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Memuat data monitoring...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* SECTION 1: PEMINJAM AKTIF (Jatuh Tempo) */}
      <div className="bg-white rounded-xl shadow-sm border border-red-100 overflow-hidden">
        <div className="p-6 border-b border-red-50 bg-red-50/30 flex justify-between items-center">
          <h2 className="text-lg font-bold text-red-800 flex items-center gap-2">
            <Clock className="w-5 h-5"/> Monitoring Jatuh Tempo
          </h2>
          <span className="text-xs bg-white border border-red-200 text-red-600 px-3 py-1 rounded-full font-medium">
            {activeRentals.length} Sedang Disewa
          </span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-medium">
              <tr>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Barang Utama</th>
                <th className="px-6 py-3">Deadline</th>
                <th className="px-6 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activeRentals.map((rental) => {
                const isUrgent = new Date(rental.dueDate) <= new Date(new Date().setDate(new Date().getDate() + 1)); // H-1 atau lewat
                return (
                  <tr key={rental.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-bold text-slate-800">
                      {rental.customer.name}
                      <div className="text-xs text-slate-400 font-normal">{rental.customer.whatsapp}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {rental.items[0]?.product.name} 
                      {rental.items.length > 1 && <span className="text-xs text-slate-400"> +{rental.items.length - 1} lainnya</span>}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${isUrgent ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {new Date(rental.dueDate).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' })}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleSendNotification(rental.customerId, 'REMINDER', rental.customer.name, rental.dueDate)}
                        disabled={sendingId === rental.customerId}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg text-xs font-bold inline-flex items-center gap-2 disabled:opacity-50"
                      >
                        {sendingId === rental.customerId ? <Loader2 className="animate-spin w-3 h-3"/> : <Bell size={14}/>}
                        Ingatkan (H-1)
                      </button>
                    </td>
                  </tr>
                );
              })}
              {activeRentals.length === 0 && (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-400 italic">Tidak ada barang yang sedang disewa.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 2: BARU SELESAI (Ucapan Terima Kasih) */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600"/> Riwayat Selesai Baru-baru Ini
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <tbody className="divide-y divide-slate-100">
              {completedRentals.map((rental) => (
                <tr key={rental.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-bold text-slate-800">{rental.customer.name}</td>
                  <td className="px-6 py-4 text-slate-500">Invoice: {rental.invoiceCode}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleSendNotification(rental.customerId, 'THANK_YOU', rental.customer.name)}
                      disabled={sendingId === rental.customerId}
                      className="border border-indigo-200 text-indigo-700 hover:bg-indigo-50 px-3 py-2 rounded-lg text-xs font-bold inline-flex items-center gap-2 disabled:opacity-50"
                    >
                      {sendingId === rental.customerId ? <Loader2 className="animate-spin w-3 h-3"/> : <Send size={14}/>}
                      Kirim "Terima Kasih"
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}