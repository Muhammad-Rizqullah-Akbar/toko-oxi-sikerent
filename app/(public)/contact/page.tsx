'use client';

import React, { useState, useRef } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle2, MessageSquare } from 'lucide-react';
import { submitContactMessage } from '@/app/actions/contact';

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('idle');

    const formData = new FormData(e.currentTarget);
    const result = await submitContactMessage(formData);

    if (result.success) {
      setStatus('success');
      formRef.current?.reset(); // Kosongkan form
    } else {
      setStatus('error');
    }

    setIsSubmitting(false);
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      <Header />

      {/* HEADER SECTION */}
      <div className="bg-white pt-28 pb-12 border-b border-slate-100">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <span className="text-indigo-600 font-bold text-sm tracking-wider uppercase mb-2 block">Hubungi Kami</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">Kami Siap Membantu</h1>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg">
            Punya pertanyaan soal sewa alat atau cetak banner? Isi formulir di bawah atau hubungi kami langsung via WhatsApp.
          </p>
        </div>
      </div>

      <main className="container mx-auto px-4 max-w-6xl py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          
          {/* KOLOM KIRI: FORMULIR (Span 2) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-indigo-600" /> Kirim Pesan
              </h2>

              {status === 'success' ? (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center animate-in fade-in zoom-in duration-300">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-green-800 mb-2">Pesan Terkirim!</h3>
                  <p className="text-green-700">Terima kasih sudah menghubungi kami. Tim Toko Oxi akan membalas pesan Anda secepatnya.</p>
                  <button onClick={() => setStatus('idle')} className="mt-6 text-green-700 font-bold hover:underline text-sm">
                    Kirim pesan lain
                  </button>
                </div>
              ) : (
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-bold text-slate-700">Nama Lengkap</label>
                      <input 
                        required 
                        type="text" 
                        name="name" 
                        id="name"
                        placeholder="Masukkan nama Anda" 
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-bold text-slate-700">Email</label>
                      <input 
                        required 
                        type="email" 
                        name="email" 
                        id="email"
                        placeholder="nama@email.com" 
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-bold text-slate-700">Subjek</label>
                    <input 
                      type="text" 
                      name="subject" 
                      id="subject"
                      placeholder="Contoh: Tanya Harga Cetak Banner" 
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-bold text-slate-700">Pesan</label>
                    <textarea 
                      required 
                      name="message" 
                      id="message"
                      rows={5} 
                      placeholder="Tuliskan detail kebutuhan atau pertanyaan Anda disini..." 
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all resize-none"
                    ></textarea>
                  </div>

                  <button 
                    disabled={isSubmitting}
                    type="submit" 
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <> <Loader2 className="animate-spin" /> Mengirim... </>
                    ) : (
                      <> <Send size={18} /> Kirim Pesan </>
                    )}
                  </button>
                  
                  {status === 'error' && (
                    <p className="text-red-500 text-sm text-center font-medium bg-red-50 p-2 rounded-lg">
                      Maaf, terjadi kesalahan. Silakan coba lagi nanti.
                    </p>
                  )}
                </form>
              )}
            </div>
          </div>

          {/* KOLOM KANAN: INFO KONTAK */}
          <div className="space-y-6">
            
            {/* Kartu WhatsApp (Highlighted) */}
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-6 text-white shadow-lg shadow-green-200 relative overflow-hidden group">
               <div className="relative z-10">
                 <h3 className="font-bold text-xl mb-2">Butuh Respon Cepat?</h3>
                 <p className="text-green-100 text-sm mb-6 opacity-90">Chat admin kami via WhatsApp untuk konfirmasi stok realtime.</p>
                 <a 
                   href="https://wa.me/6285333355881" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="bg-white text-green-600 px-6 py-3 rounded-xl font-bold text-sm inline-flex items-center gap-2 hover:bg-green-50 transition-colors shadow-sm"
                 >
                   <Phone size={16} /> Chat WhatsApp
                 </a>
               </div>
               {/* Hiasan Background */}
               <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white opacity-10 rounded-full group-hover:scale-110 transition-transform"></div>
            </div>

            {/* Kartu Alamat */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
               <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mb-4">
                 <MapPin size={20} />
               </div>
               <h4 className="font-bold text-slate-800 mb-1">Lokasi Workshop</h4>
               <p className="text-slate-500 text-sm leading-relaxed mb-4">
                 Tamalanrea, Kota Makassar, <br/> Sulawesi Selatan 90245
               </p>
               <a href="https://www.google.com/maps?q=-5.135100,119.485000" target="_blank" className="text-indigo-600 text-sm font-bold hover:underline">
                 Lihat di Google Maps &rarr;
               </a>
            </div>

             {/* Kartu Email */}
             <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
               <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center text-orange-600 mb-4">
                 <Mail size={20} />
               </div>
               <h4 className="font-bold text-slate-800 mb-1">Email Support</h4>
               <p className="text-slate-500 text-sm leading-relaxed mb-4">
                 Untuk penawaran kerjasama atau keluhan layanan.
               </p>
               <a href="mailto:halo@tokooxi.com" className="text-slate-800 font-medium hover:text-indigo-600 transition-colors">
                 halo@tokooxi.com
               </a>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}