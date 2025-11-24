"use client";

import { useState } from "react";

export default function NotificationSettingsPage() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [title, setTitle] = useState("⚠️ Waktu Sewa Habis!");
  const [message, setMessage] = useState("Halo {nama}, sewa {barang} jatuh tempo hari ini.");
  const [logs, setLogs] = useState<string[]>([]);

  // Fungsi 1: Minta Izin Browser (Subscribe)
  const subscribeUser = async () => {
    if ("serviceWorker" in navigator) {
      try {
        const register = await navigator.serviceWorker.register("/sw.js");
        
        // GANTI DENGAN PUBLIC KEY YANG ANDA GENERATE DI TERMINAL TADI
        // Pastikan ini ada di .env.local anda
        const applicationServerKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY; 

        if (!applicationServerKey) {
            addLog("❌ VAPID Public Key belum disetting di .env");
            return;
        }

        const subscription = await register.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: applicationServerKey,
        });

        await fetch("/api/web-push/subscribe", {
          method: "POST",
          body: JSON.stringify(subscription),
          headers: { "Content-Type": "application/json" },
        });

        setIsSubscribed(true);
        addLog("✅ Perangkat ini berhasil didaftarkan untuk menerima notifikasi.");
      } catch (error) {
        console.error("Gagal subscribe:", error);
        addLog("❌ Gagal mendaftarkan perangkat. Pastikan izin notifikasi 'Allow'.");
      }
    } else {
      addLog("❌ Service Worker tidak didukung di browser ini.");
    }
  };

  // Fungsi 2: Kirim Pesan Test (Simulasi)
  const sendTestNotification = async () => {
    addLog(`⏳ Mengirim notifikasi ke browser...`);
    addLog(`> Title: "${title}"`);
    addLog(`> Body: "${message}"`);

    try {
      await fetch("/api/web-push/send", {
        method: "POST",
        body: JSON.stringify({ title, message }),
        headers: { "Content-Type": "application/json" },
      });
      addLog("🚀 Notifikasi terkirim! Cek layar HP/Laptop Anda.");
    } catch (error) {
        console.error(error);
      addLog("❌ Gagal mengirim request ke server.");
    }
  };

  const addLog = (text: string) => {
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [`[${time}] ${text}`, ...prev]);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8 border-b pb-4 border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800">
          Notifikasi Pengingat Browser (Web Push)
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Atur pengingat pengembalian otomatis yang muncul langsung di layar perangkat pelanggan.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Kolom Kiri: Pengaturan */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Card Status */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-700">Status Perangkat Admin</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${isSubscribed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {isSubscribed ? "TERHUBUNG" : "BELUM TERHUBUNG"}
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Klik tombol di bawah untuk mendaftarkan laptop ini sebagai penerima notifikasi (Test Device).
            </p>
            <button
              onClick={subscribeUser}
              disabled={isSubscribed}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
            >
              {isSubscribed ? "Perangkat Sudah Terdaftar" : "Izinkan Notifikasi (Subscribe)"}
            </button>
          </div>

          {/* Card Template */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-700 mb-4">Template Pesan Pengingat</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Judul Notifikasi</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  // PERBAIKAN DI SINI: text-gray-900 dan bg-white ditambahkan
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-400"
                  placeholder="Contoh: Waktu Sewa Habis!"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Isi Pesan</label>
                <textarea 
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  // PERBAIKAN DI SINI: text-gray-900 dan bg-white ditambahkan
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-400"
                  placeholder="Gunakan placeholder {nama}, {barang}..."
                />
                <p className="text-xs text-gray-400 mt-1">Disarankan maksimal 2 kalimat singkat.</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button 
                onClick={sendTestNotification}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
              >
                <span>🚀</span> Simpan & Kirim Test
              </button>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Log Simulasi */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-700">Log Simulasi</h3>
              <p className="text-xs text-gray-400">Menampilkan aktivitas sistem real-time.</p>
            </div>
            <div className="p-4 bg-gray-900 flex-1 rounded-b-xl font-mono text-xs overflow-y-auto max-h-[500px]">
              {logs.length === 0 ? (
                <span className="text-gray-500 italic">Menunggu aktivitas...</span>
              ) : (
                logs.map((log, i) => (
                  <div key={i} className="mb-2 border-l-2 border-green-500 pl-2">
                    <p className="text-green-400">{log}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}