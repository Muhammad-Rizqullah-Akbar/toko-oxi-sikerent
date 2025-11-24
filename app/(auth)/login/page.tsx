"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => setLoading(false), 800);
  };

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
        
        {/* Heading */}
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Masuk ke Akun
        </h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition shadow-sm"
          >
            {loading ? "Memproses..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-5">
          Belum punya akun?{" "}
          <Link href="/register" className="text-indigo-600 font-semibold hover:underline">
            Daftar
          </Link>
        </p>
      </div>
    </div>
  );
}
