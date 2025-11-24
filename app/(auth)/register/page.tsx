"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      alert("Password tidak sama.");
      setLoading(false);
      return;
    }

    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl border border-gray-200 shadow-sm">

        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Daftar Akun
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Nama */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Nama Lengkap
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Nama Anda"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Email */}
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

          {/* Password */}
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

          {/* Konfirmasi Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Konfirmasi Password
            </label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition shadow-sm"
          >
            {loading ? "Memproses..." : "Daftar"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-5">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-indigo-600 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
