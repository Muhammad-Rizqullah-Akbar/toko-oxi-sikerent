import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-slate-50 pt-28 pb-20 lg:pt-36 lg:pb-32">
      
      {/* --- BACKGROUND DECORATION (BLOB ANIMATION) --- */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-[10%] left-[-10%] w-[400px] h-[400px] bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* --- KOLOM KIRI: TEKS & CTA --- */}
          <div className="text-center lg:text-left">
            {/* Badge Kecil */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-indigo-100 text-indigo-600 text-xs font-bold mb-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
              <Sparkles size={14} className="text-yellow-500" />
              <span>Solusi Event & Percetakan #1</span>
            </div>

            {/* Headline Besar */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 leading-[1.15] animate-in fade-in slide-in-from-bottom-6 duration-1000">
              Sewa Alat & Cetak <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                Tanpa Ribet.
              </span>
            </h1>

            {/* Deskripsi */}
            <p className="text-lg text-slate-500 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
              Platform lengkap untuk kebutuhan mahasiswa. Mulai dari sewa kamera, sound system, hingga cetak banner kilat. Harga bersahabat, kualitas pejabat.
            </p>

            {/* Tombol Aksi */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200">
              <Link 
                href="#catalog" // Pastikan ID ini ada di section katalog di page.tsx
                className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-200 hover:shadow-indigo-300 flex items-center justify-center gap-2 group"
              >
                Mulai Sewa <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </Link>
              <Link 
                href="/contact" 
                className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl font-bold transition-all flex items-center justify-center hover:border-indigo-300"
              >
                Hubungi Admin
              </Link>
            </div>

            {/* Trust Signals (Poin-poin kecil di bawah tombol) */}
            <div className="mt-10 flex flex-wrap gap-4 justify-center lg:justify-start text-sm text-slate-500 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
               <div className="flex items-center gap-2">
                 <CheckCircle2 size={16} className="text-green-500" /> Proses Cepat
               </div>
               <div className="flex items-center gap-2">
                 <CheckCircle2 size={16} className="text-green-500" /> Barang Terawat
               </div>
               <div className="flex items-center gap-2">
                 <CheckCircle2 size={16} className="text-green-500" /> Siap Antar
               </div>
            </div>
          </div>

          {/* --- KOLOM KANAN: VISUAL (GAMBAR) --- */}
          <div className="relative animate-in fade-in zoom-in duration-1000 delay-300 hidden lg:block">
            {/* Background Shape */}
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-100 to-purple-100 rounded-[2rem] transform rotate-3 scale-95 -z-10"></div>
            
            {/* Main Image Container */}
            <div className="relative bg-white rounded-2xl shadow-2xl p-4 border border-slate-100 transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-slate-200">
                    {/* GANTI SRC INI DENGAN FOTO PRODUK ASLI ANDA NANTI */}
                    <Image 
                      src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                      alt="Kamera dan Peralatan"
                      fill
                      className="object-cover"
                      priority
                    />
                </div>
                
                {/* Floating Card Kecil (Dekorasi) */}
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl border border-slate-50 flex items-center gap-3 animate-bounce-slow">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                        <Sparkles size={20} />
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 font-bold uppercase">Promo Spesial</p>
                        <p className="text-sm font-bold text-slate-800">Diskon Mahasiswa 10%</p>
                    </div>
                </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}