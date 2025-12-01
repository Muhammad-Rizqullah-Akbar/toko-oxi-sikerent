'use client';

import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useMotionTemplate, useTransform } from 'framer-motion';
import { Mail, Lock, LogIn, ArrowRight, UserPlus, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { loginCustomer } from '@/app/actions/auth-server-actions'; // Import Server Action
import { useRouter } from 'next/navigation';

// Constants untuk Tilt Effect
const ROTATION_RANGE = 12;
const SCALE_HOVER = 1.03;

export default function LoginPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // --- 1. FRAMER MOTION SETUP (Interactivity) ---
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [0, 1], [-ROTATION_RANGE, ROTATION_RANGE]);
  const rotateY = useTransform(mouseX, [0, 1], [ROTATION_RANGE, -ROTATION_RANGE]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const result = await loginCustomer(formData);

    if (result && result.message) {
        alert(result.message); // Tampilkan pesan error jika login gagal
    } 
    
    // Jika sukses, Server Action NextAuth akan menangani redirect, jadi kita hanya reset state jika gagal
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center font-sans px-4 py-12 overflow-hidden">

      <div className="grid grid-cols-1 md:grid-cols-2 max-w-6xl w-full rounded-3xl shadow-2xl overflow-hidden relative">
        
        {/* --- KOLOM KIRI: WEB3 VISUAL & BRANDING --- */}
        <div className="bg-gradient-to-br from-indigo-900 to-purple-900 p-10 hidden md:flex flex-col justify-between relative overflow-hidden">
          
          {/* Efek Particle (Placeholder Aesthetic) */}
          <div className="absolute inset-0 opacity-50 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/-100,30,0/512x512?access_token=YOUR_ACCESS_TOKEN')] bg-repeat"></div>
          
          <div className="relative z-10">
             <h2 className="text-4xl font-extrabold text-white mb-4 tracking-tight">Selamat Datang Kembali!</h2>
             <p className="text-indigo-200">Akses riwayat pesanan, poin loyalitas, dan checkout kilat di Toko Oxi.</p>
          </div>
          
          <div className="mt-auto relative z-10">
             <p className="text-indigo-400 text-sm font-medium mb-3 flex items-center gap-2">
                <ArrowRight size={16} className="rotate-45" /> Belum punya akun?
             </p>
             <Link 
                href="/register" // [FIXED LINK]
                className="bg-white/20 border border-white/30 text-white font-bold py-3 px-6 rounded-full inline-flex items-center gap-2 hover:bg-white/30 transition-colors backdrop-blur-sm"
             >
                <UserPlus size={18} /> Daftar Sekarang
             </Link>
          </div>
        </div>

        {/* --- KOLOM KANAN: LOGIN FORM (INTERACTIVE CARD) --- */}
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ transform: transformStyle }}
          whileHover={{ scale: SCALE_HOVER }}
          className="bg-white p-10 lg:p-14 relative z-20 flex flex-col justify-center"
        >
          <h3 className="text-3xl font-extrabold text-slate-800 mb-2">Masuk ke Akun</h3>
          <p className="text-slate-500 mb-8">Masukkan WhatsApp atau Email & Password Anda.</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Input Email/WhatsApp */}
            <div>
              <label htmlFor="identifier" className="text-sm font-bold text-slate-700 block mb-2">Email / WhatsApp</label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                <input 
                  id="identifier"
                  type="text"
                  name="identifier" // Tambahkan name untuk FormData
                  placeholder="WhatsApp atau Email Anda"
                  required
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-slate-800 font-medium tracking-wide"
                />
              </div>
            </div>

            {/* Input Password */}
            <div>
              <label htmlFor="password" className="text-sm font-bold text-slate-700 block mb-2">Password</label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                <input 
                  id="password"
                  type="password"
                  name="password" // Tambahkan name untuk FormData
                  placeholder="********"
                  required
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-slate-800 font-medium tracking-wide"
                />
              </div>
            </div>

            {/* Tombol Aksi */}
            <motion.button 
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-200 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <> <Loader2 className="animate-spin" /> Sedang Memuat... </>
              ) : (
                <> <LogIn size={20} /> Masuk </>
              )}
            </motion.button>
            
            {/* Link Lupa Password */}
            <div className="text-center pt-2">
                <Link href="/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-700 hover:underline transition-colors"> {/* [FIXED LINK] */}
                    Lupa Password?
                </Link>
            </div>
            
            {/* Mobile Link Register */}
            <div className="pt-4 text-center md:hidden">
                <p className="text-sm text-slate-500">Belum punya akun? <Link href="/register" className="text-indigo-600 font-bold hover:underline">Daftar</Link></p> {/* [FIXED LINK] */}
            </div>

          </form>
        </motion.div>
      </div>
    </div>
  );
}