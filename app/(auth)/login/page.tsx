// app/(auth)/login/page.tsx

'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertCircle, Mail, Lock } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/profile';
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Gunakan NextAuth signIn, BUKAN fetch ke custom API
      const result = await signIn('credentials', {
        identifier: formData.identifier,
        password: formData.password,
        redirect: false, // Tidak redirect otomatis
      });

      console.log('Login result:', result);

      if (result?.error) {
        setError('Email/WhatsApp atau password salah');
      } else if (result?.ok) {
        // Login sukses, redirect ke callbackUrl
        router.push(callbackUrl);
        router.refresh(); // Refresh untuk update auth state
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Terjadi kesalahan saat login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-800">Masuk ke Akun</h2>
          <p className="mt-2 text-slate-600">
            Gunakan Email, WhatsApp, atau Username
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email / WhatsApp / Username
              </label>
              <input
                type="text"
                value={formData.identifier}
                onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                placeholder="email@contoh.com atau 628123456789"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Lock className="w-4 h-4 inline mr-2" />
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Memproses...
                </>
              ) : (
                'Masuk'
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-slate-600">
              Belum punya akun?{' '}
              <Link href="/register" className="text-indigo-600 hover:text-indigo-700 font-medium">
                Daftar di sini
              </Link>
            </p>
          </div>

        </form>
      </div>
    </div>
  );
}