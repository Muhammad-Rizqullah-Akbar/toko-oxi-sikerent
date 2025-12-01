'use client';

import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useMotionTemplate, useTransform } from 'framer-motion';
import { Mail, ArrowRight, Loader2, KeyRound, Lock, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

// Constants untuk Tilt Effect
const ROTATION_RANGE = 12; 
const SCALE_HOVER = 1.03; 

export default function ForgotPasswordPage() {
  const [status, setStatus] = useState<'input' | 'submitting' | 'success'>('input');
  const cardRef = useRef<HTMLDivElement>(null);

  // --- 1. FRAMER MOTION SETUP (Interactivity) ---
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [0, 1], [-ROTATION_RANGE, ROTATION_RANGE]);
  const rotateY = useTransform(mouseX, [0, 1], [ROTATION_RANGE, -ROTATION_RANGE]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || status !== 'input') return; // Hanya aktif saat input stage

    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const x = (e.clientX - rect.left) / width;
    const y = (e.clientY - rect.top) / height;

    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };
  
  const transformStyle = useMotionTemplate`perspective(1000px) rotateX(${rotateX}) rotateY(${rotateY})`;

  const handlePasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    
    // [SIMULASI LOGIC SERVER]
    await new Promise(r => setTimeout(r, 2000)); 
    
    setStatus('success'); // Ganti dengan logic server asli
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center font-sans px-4 py-12 overflow-hidden">

      <div className="grid grid-cols-1 md:grid-cols-2 max-w-5xl w-full rounded-3xl shadow-2xl overflow-hidden relative">
        
        {/* --- KOLOM KIRI: VISUAL & BRANDING --- */}
        <div className="bg-gradient-to-br from-indigo-900 to-purple-900 p-10 hidden md:flex flex-col justify-between relative overflow-hidden">
          
          <div className="absolute inset-0 opacity-50 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/-100,30,0/512x512?access_token=YOUR_ACCESS_TOKEN')] bg-repeat"></div>
          
          <div className="relative z-10">
             <div className="w-16 h-16 bg-white/20 border border-white/30 rounded-full flex items-center justify-center mb-4">
                <KeyRound size={32} className="text-white" />
             </div>
             <h2 className="text-4xl font-extrabold text-white mb-4 tracking-tight">Keamanan Akun Anda</h2>
             <p className="text-indigo-200">Kami akan mengirimkan instruksi reset ke email atau WhatsApp Anda yang terdaftar.</p>
          </div>
          
          <div className="mt-auto relative z-10">
             <Link 
                href="/login"
                className="bg-white/20 border border-white/30 text-white font-bold py-3 px-6 rounded-full inline-flex items-center gap-2 hover:bg-white/30 transition-colors backdrop-blur-sm"
             >
                <ArrowRight size={18} className="rotate-180" /> Kembali ke Login
             </Link>
          </div>
        </div>

        {/* --- KOLOM KANAN: FORM RECOVERY (INTERACTIVE CARD) --- */}
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ transform: transformStyle }}
          whileHover={{ scale: status === 'input' ? SCALE_HOVER : 1 }} // Tilt hanya aktif saat input
          className="bg-white p-10 lg:p-14 relative z-20 flex flex-col justify-center"
        >
            
            {/* TAHAP 1: INPUT FORM */}
            {status === 'input' || status === 'submitting' ? (
                <>
                    <h3 className="text-3xl font-extrabold text-slate-800 mb-2">Lupa Password Anda?</h3>
                    <p className="text-slate-500 mb-8">Masukkan email atau nomor WhatsApp yang terdaftar.</p>
                    
                    <form onSubmit={handlePasswordReset} className="space-y-6">
                        
                        <div>
                            <label htmlFor="identifier" className="text-sm font-bold text-slate-700 block mb-2">Email atau WhatsApp</label>
                            <div className="relative">
                                <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                                <input 
                                    id="identifier"
                                    type="text"
                                    placeholder="Email atau +62 8xx xxxx xxxx"
                                    required
                                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-slate-800 font-medium tracking-wide"
                                    disabled={status === 'submitting'}
                                />
                            </div>
                        </div>

                        <motion.button 
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={status === 'submitting'}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-200 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                        >
                            {status === 'submitting' ? (
                                <> <Loader2 className="animate-spin" /> Mengirim Instruksi... </>
                            ) : (
                                <> <Lock size={20} /> Reset Password </>
                            )}
                        </motion.button>
                    </form>
                </>
            ) : (
                
                // TAHAP 2: PESAN SUKSES
                <div className="text-center py-6 animate-in fade-in zoom-in duration-500">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">Instruksi Terkirim!</h3>
                    <p className="text-slate-500 mb-8">
                        Silakan cek email/WhatsApp Anda. Link untuk mengubah password hanya berlaku selama 30 menit.
                    </p>
                    <Link href="/login" className="text-indigo-600 font-bold hover:underline transition-colors flex items-center justify-center">
                        Selesai, Kembali ke Login →
                    </Link>
                </div>
            )}
        </motion.div>
      </div>
    </div>
  );
}