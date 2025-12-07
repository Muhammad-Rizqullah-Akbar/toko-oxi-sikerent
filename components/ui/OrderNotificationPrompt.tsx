'use client';

import { useState } from 'react';
import { Bell, CheckCircle2 } from 'lucide-react';

export default function OrderNotificationPrompt() {
  const [permission, setPermission] = useState(Notification.permission);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const subscribeUser = async () => {
    if (!("serviceWorker" in navigator)) return;

    try {
      const register = await navigator.serviceWorker.ready; // Pastikan SW sudah ready
      const applicationServerKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

      if (!applicationServerKey) return console.error("Missing VAPID Key");

      const subscription = await register.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey,
      });

      // Kirim ke server
      await fetch("/api/web-push/subscribe", {
        method: "POST",
        body: JSON.stringify(subscription),
        headers: { "Content-Type": "application/json" },
      });

      setIsSubscribed(true);
      setPermission('granted');
      alert("Notifikasi aktif! Kami akan mengabari status pesanan Anda.");
    } catch (error) {
      console.error("Gagal subscribe:", error);
      alert("Gagal mengaktifkan notifikasi. Pastikan izin browser diberikan.");
    }
  };

  // Jika sudah diizinkan atau diblokir, jangan tampilkan apa-apa (agar tidak mengganggu)
  // Kecuali kita mau kasih tombol manual.
  if (permission === 'denied') return null;
  if (isSubscribed || permission === 'granted') return null;

  return (
    <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mt-6 flex items-start gap-4">
      <div className="p-2 bg-white rounded-full text-indigo-600 shadow-sm">
        <Bell size={20} />
      </div>
      <div className="flex-1">
        <h4 className="font-bold text-indigo-900 text-sm">Pantau Pesanan Anda</h4>
        <p className="text-xs text-indigo-700 mt-1 mb-3">
          Izinkan notifikasi agar Anda tahu saat barang siap diambil atau kurir sedang menuju lokasi.
        </p>
        <button 
          onClick={subscribeUser}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors"
        >
          Aktifkan Notifikasi
        </button>
      </div>
    </div>
  );
}