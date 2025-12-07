// public/sw.js

self.addEventListener('push', function (event) {
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.message || 'Ada notifikasi baru untuk Anda!',
      icon: '/icons/icon-192x192.png', // Ganti dengan path icon logo Anda jika ada
      badge: '/icons/badge-72x72.png', // Icon kecil di status bar (Android)
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: '2'
      },
      actions: [
        { action: 'explore', title: 'Lihat Detail' },
        { action: 'close', title: 'Tutup' }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'Toko Oxi Admin', options)
    );
  }
});
 
self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  
  // Buka halaman dashboard saat notif diklik
  event.waitUntil(
    clients.openWindow('/dashboard')
  );
});