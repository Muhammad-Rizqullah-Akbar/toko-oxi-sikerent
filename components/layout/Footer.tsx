// components/layout/Footer.tsx

import React from 'react';
import { MapPin, Instagram, Facebook, ShoppingBag, Send } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    // Gunakan warna latar belakang gelap seperti yang terlihat pada wireframe (image_cc3b49.png)
    <footer className="bg-gray-900 text-white pt-12 pb-6 border-t border-indigo-600">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Konten Utama Footer (Dipisahkan menjadi 2 kolom: Maps dan Info) */}
        <div className="flex flex-col md:flex-row justify-between mb-8">
          
          {/* 1. Kolom Kiri: Placeholder Lokasi Maps */}
          <div className="w-full md:w-1/3 h-64 bg-gray-700 rounded-lg shadow-xl mb-8 md:mb-0 md:mr-8 flex items-center justify-center text-sm text-gray-400">
            <div className="text-center">
                <MapPin className="w-6 h-6 mx-auto mb-2 text-indigo-400" />
                [Placeholder Lokasi Maps TOKO OXI]
                <p className='mt-2'>Lokasi Percetakan dan Konveksi</p>
            </div>
          </div>

          {/* 2. Kolom Kanan: Detail Informasi dan Tautan */}
          <div className="w-full md:w-2/3 grid grid-cols-2 lg:grid-cols-3 gap-8 text-sm">
            
            {/* Kolom 2.1: Branding & Logo */}
            <div>
              <h4 className="font-bold text-lg mb-3">TOKO OXI</h4>
              <div className="w-20 h-20 bg-indigo-600 rounded-md mb-2 flex items-center justify-center">
                [Logo Kecil]
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Penyedia jasa Percetakan dan Konveksi terpercaya sejak 2020.
              </p>
            </div>

            {/* Kolom 2.2: Media Sosial */}
            <div>
              <h4 className="font-semibold text-base mb-3 text-indigo-400">Media Sosial</h4>
              <ul className="space-y-2">
                <li><a href="#" className="flex items-center hover:text-indigo-400 transition-colors"><Instagram className="w-4 h-4 mr-2"/> Instagram</a></li>
                <li><a href="#" className="flex items-center hover:text-indigo-400 transition-colors"><Facebook className="w-4 h-4 mr-2"/> Facebook</a></li>
                <li><a href="#" className="flex items-center hover:text-indigo-400 transition-colors"><ShoppingBag className="w-4 h-4 mr-2"/> Shopee</a></li>
              </ul>
            </div>

            {/* Kolom 2.3: Hubungi Kami */}
            <div>
              <h4 className="font-semibold text-base mb-3 text-indigo-400">Hubungi Kami</h4>
              <ul className="space-y-2">
                <li><a href="#" className="flex items-center hover:text-indigo-400 transition-colors"><Send className="w-4 h-4 mr-2"/> WhatsApp Admin 1</a></li>
                <li><a href="#" className="flex items-center hover:text-indigo-400 transition-colors"><Send className="w-4 h-4 mr-2"/> WhatsApp Admin 2</a></li>
                <li><a href="#" className="flex items-center hover:text-indigo-400 transition-colors"><Send className="w-4 h-4 mr-2"/> WhatsApp Admin 3</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="pt-4 border-t border-gray-700 text-center text-xs text-gray-500 mt-8">
          <p>&copy; {new Date().getFullYear()} TOKO OXI. All rights reserved.</p>
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;