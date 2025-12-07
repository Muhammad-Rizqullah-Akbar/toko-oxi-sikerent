// app/(auth)/register/page.tsx - STATIC VERSION
'use client';

import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useMotionTemplate, useTransform } from 'framer-motion';
import { Mail, Lock, LogIn, ArrowRight, UserPlus, Loader2, User, Smartphone } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const ROTATION_RANGE = 12;
const SCALE_HOVER = 1.03;

export default function RegisterPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const cardRef = useRef<HTMLDivElement>(null);

  // Framer Motion setup
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [0, 1], [-ROTATION_RANGE, ROTATION_RANGE]);
  const rotateY = useTransform(mouseX, [0, 1], [ROTATION_RANGE, -ROTATION_RANGE]);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };
  
  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };
  
  const transformStyle = useMotionTemplate`perspective(1000px) rotateX(${rotateX}) rotateY(${rotateY})`;

  // LOGIC REGISTER LANGSUNG DI SINI
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData(e.currentTarget);
      const name = formData.get('name') as string;
      const whatsapp = formData.get('whatsapp') as string;
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;
      const confirmPassword = formData.get('confirm-password') as string;

      // Validasi sederhana
      if (!name || name.length < 3) {
        setError('Nama minimal 3 karakter');
        setIsSubmitting(false);
        return;
      }

      if (!whatsapp) {
        setError('WhatsApp wajib diisi');
        setIsSubmitting(false);
        return;
      }

      if (!password || password.length < 6) {
        setError('Password minimal 6 karakter');
        setIsSubmitting(false);
        return;
      }

      if (password !== confirmPassword) {
        setError('Password tidak cocok');
        setIsSubmitting(false);
        return;
      }

      // Kirim request register
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          whatsapp,
          email: email || '',
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Registrasi berhasil! Anda akan dialihkan...');
        
        // Tunggu 2 detik lalu redirect ke login
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setError(data.message || 'Registrasi gagal');
      }
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.');
      console.error('Register error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center font-sans px-4 py-12 overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 max-w-6xl w-full rounded-3xl shadow-2xl overflow-hidden relative">
        
        {/* Kolom Kiri */}
        <div className="bg-gradient-to-br from-indigo-900 to-purple-900 p-10 hidden md:flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 opacity-50 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/-100,30,0/512x512?access_token=YOUR_ACCESS_TOKEN')] bg-repeat"></div>
          
          <div className="relative z-10">
             <h2 className="text-4xl font-extrabold text-white mb-4 tracking-tight">Mulai Petualangan Barumu!</h2>
             <p className="text-indigo-200">Daftar untuk mendapatkan akses ke semua katalog produk, fitur sewa cepat, dan promo eksklusif.</p>
          </div>
          
          <div className="mt-auto relative z-10">
             <p className="text-indigo-400 text-sm font-medium mb-3 flex items-center gap-2">
                <ArrowRight size={16} className="rotate-45" /> Sudah punya akun?
             </p>
             <Link 
                href="/login"
                className="bg-white/20 border border-white/30 text-white font-bold py-3 px-6 rounded-full inline-flex items-center gap-2 hover:bg-white/30 transition-colors backdrop-blur-sm"
             >
                <LogIn size={18} /> Masuk Sekarang
             </Link>
          </div>
        </div>

        {/* Kolom Kanan: Register Form */}
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ transform: transformStyle }}
          whileHover={{ scale: SCALE_HOVER }}
          className="bg-white p-10 lg:p-14 relative z-20 flex flex-col justify-center"
        >
          <h3 className="text-3xl font-extrabold text-slate-800 mb-2">Daftar Akun Baru</h3>
          <p className="text-slate-500 mb-8">Dapatkan akses penuh ke fitur Toko Oxi.</p>
          
          {/* Success Message */}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-lg text-sm">
              {success}
            </div>
          )}
          
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Input Nama */}
            <div>
              <label htmlFor="name" className="text-sm font-bold text-slate-700 block mb-2">Nama Lengkap</label>
              <div className="relative">
                <User className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                <input 
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Nama sesuai identitas"
                  required
                  disabled={isSubmitting}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-slate-800 font-medium tracking-wide disabled:opacity-50"
                />
              </div>
            </div>

            {/* Input WhatsApp */}
            <div>
              <label htmlFor="whatsapp" className="text-sm font-bold text-slate-700 block mb-2">Nomor WhatsApp</label>
              <div className="relative">
                <Smartphone className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                <input 
                  id="whatsapp"
                  type="tel"
                  name="whatsapp"
                  placeholder="+62 8xx xxxx xxxx"
                  required
                  disabled={isSubmitting}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-slate-800 font-medium tracking-wide disabled:opacity-50"
                />
              </div>
            </div>
            
            {/* Input Email */}
            <div>
              <label htmlFor="email" className="text-sm font-bold text-slate-700 block mb-2">Email (Opsional)</label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                <input 
                  id="email"
                  type="email"
                  name="email"
                  placeholder="nama@email.com"
                  disabled={isSubmitting}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-slate-800 font-medium tracking-wide disabled:opacity-50"
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
                  name="password"
                  placeholder="Minimal 6 karakter"
                  required
                  disabled={isSubmitting}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-slate-800 font-medium tracking-wide disabled:opacity-50"
                />
              </div>
            </div>
            
            {/* Input Konfirmasi Password */}
            <div>
              <label htmlFor="confirm-password" className="text-sm font-bold text-slate-700 block mb-2">Konfirmasi Password</label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                <input 
                  id="confirm-password"
                  type="password"
                  name="confirm-password"
                  placeholder="Ketik ulang password"
                  required
                  disabled={isSubmitting}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-slate-800 font-medium tracking-wide disabled:opacity-50"
                />
              </div>
            </div>

            {/* Tombol Aksi */}
            <motion.button 
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-200 transition-all disabled:opacity-70 flex items-center justify-center gap-2 mt-6"
            >
              {isSubmitting ? (
                <> <Loader2 className="animate-spin" /> Sedang Mendaftarkan... </>
              ) : (
                <> <UserPlus size={20} /> Daftar Akun </>
              )}
            </motion.button>
            
            {/* Link Login di Mobile */}
            <div className="text-center pt-4 md:hidden">
                <p className="text-sm text-slate-500">Sudah punya akun? <Link href="/login" className="text-indigo-600 font-bold hover:underline">Masuk</Link></p>
            </div>

          </form>
        </motion.div>
      </div>
    </div>
  );
}