// components/layout/Footer.tsx
import React from 'react';
import Link from 'next/link';
import { 
  MapPin, Instagram, Facebook, ShoppingBag, 
  Phone, Mail, Clock, ArrowRight, ExternalLink 
} from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  // Data Link
  const mapsUrl = "https://www.google.com/maps?q=-5.135100,119.485000";
  const whatsappUrl = "https://wa.me/6285333355881";
  const instagramUrl = "https://www.instagram.com/toko_oxi/";
  const facebookUrl = "https://www.facebook.com/people/Toko-Oxi/100080005373339/";
  const shopeeUrl = "https://shopee.co.id/tokooxi3";

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800 font-sans">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* GRID UPDATE: Ubah jadi lg:grid-cols-3 agar seimbang (Kiri - Tengah - Kanan) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
          
          {/* 1. BRANDING & LOKASI (KIRI) */}
          <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-extrabold text-white tracking-tight">TOKO OXI</h2>
                <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                  Solusi lengkap mahasiswa & umum. Jasa Percetakan, Sewa Alat, Sablon & Bordir Berkualitas di Makassar.
                </p>
            </div>

            {/* Peta Mini */}
            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex items-start gap-3 hover:bg-slate-750 transition-colors group">
                <MapPin className="w-5 h-5 text-indigo-400 shrink-0 mt-1 group-hover:text-indigo-300" />
                <div className="text-sm">
                    <p className="text-white font-medium">Lokasi Workshop</p>
                    <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                       Jl. Politeknik, Tamalanrea Indah,<br/>Makassar, Sulawesi Selatan
                    </p>
                    <a 
                        href={mapsUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-indigo-400 text-xs font-bold mt-3 inline-flex items-center hover:text-indigo-300 transition-colors"
                    >
                        Buka di Google Maps <ExternalLink size={10} className="ml-1"/>
                    </a>
                </div>
            </div>
          </div>

          {/* 2. JAM OPERASIONAL & KONTAK (TENGAH) */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Jam Operasional</h3>
            <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                    <Clock className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-white font-medium">Buka Setiap Hari</p>
                        <p className="text-slate-400 text-xs mb-1">Senin - Minggu</p>
                        <p className="text-green-400 font-bold tracking-wide text-base">08.00 - 22.00 WITA</p>
                    </div>
                </li>
                
                <div className="pt-2 space-y-4">
                    <li className="flex items-start gap-3">
                        <Phone className="w-5 h-5 text-indigo-500 shrink-0" />
                        <div>
                            <p className="text-white font-medium">WhatsApp Admin</p>
                            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-green-400 transition-colors font-mono tracking-wide">
                                +62 853-3335-5881
                            </a>
                        </div>
                    </li>
                    <li className="flex items-start gap-3">
                        <Mail className="w-5 h-5 text-indigo-500 shrink-0" />
                        <div>
                            <p className="text-white font-medium">Email Support</p>
                            <a href="mailto:halo@tokooxi.com" className="text-slate-400 hover:text-white transition-colors">
                                halo@tokooxi.com
                            </a>
                        </div>
                    </li>
                </div>
            </ul>
          </div>

          {/* 3. SOSMED & PROMO (KANAN) */}
          <div>
             <h3 className="text-white font-bold text-lg mb-6">Temukan Kami</h3>
             <div className="flex gap-4 mb-8">
                 <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all text-slate-400 group border border-slate-700 hover:border-pink-500 hover:-translate-y-1 shadow-lg" title="Instagram">
                    <Instagram size={22} className="group-hover:scale-110 transition-transform"/>
                 </a>
                 <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all text-slate-400 group border border-slate-700 hover:border-blue-500 hover:-translate-y-1 shadow-lg" title="Facebook">
                    <Facebook size={22} className="group-hover:scale-110 transition-transform"/>
                 </a>
                 <a href={shopeeUrl} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all text-slate-400 group border border-slate-700 hover:border-orange-500 hover:-translate-y-1 shadow-lg" title="Shopee">
                    <ShoppingBag size={22} className="group-hover:scale-110 transition-transform"/>
                 </a>
             </div>
             
             {/* Box Promo Kecil */}
             <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-5 rounded-2xl border border-indigo-500/30 shadow-xl relative overflow-hidden group">
                <div className="relative z-10">
                    <p className="text-xs text-indigo-200 font-bold mb-3 uppercase tracking-wider">Diskon Mahasiswa ✨</p>
                    <div className="flex gap-2">
                        <input type="email" placeholder="Email kamu..." className="bg-slate-950/50 border border-slate-700 text-white text-xs rounded-lg px-3 py-3 w-full focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-600" />
                        <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 rounded-lg transition-colors flex items-center justify-center">
                            <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
                {/* Dekorasi Background */}
                <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-indigo-500 opacity-20 rounded-full blur-2xl group-hover:opacity-30 transition-opacity"></div>
             </div>
          </div>

        </div>
        
        {/* COPYRIGHT */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© {currentYear} TOKO OXI MAKASSAR. All rights reserved.</p>
          <div className="flex gap-6">
             <Link href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
             <Link href="#" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
          </div>
        </div>
        
      </div>
    </footer>
  );
}