// components/layout/Header.tsx (UPDATE)

'use client';
import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { HeaderActionsClient } from './HeaderActionsClient';
import { useAuth } from '@/hooks/useAuth';

const Header: React.FC = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, customer, isLoading, type } = useAuth(); // Ganti role dengan type
  
  // Hydration fix & Scroll Listener
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);

    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  if (!mounted || isLoading) {
    return (
      <header className="fixed top-0 left-0 w-full bg-white shadow-sm py-4 z-50">
        <div className="container mx-auto px-4 max-w-7xl flex items-center justify-between">
          <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-10 w-32 bg-gray-200 animate-pulse rounded-full"></div>
        </div>
      </header>
    );
  }

  // Tentukan status login
  const isLoggedIn = !!customer || !!user;
  const userName = customer?.name || user?.name || null;
  const userPoints = customer?.totalPoints || 0;
  const isCustomer = type === 'customer'; // Cek apakah customer
  const isAdmin = user?.role === 'ADMIN'; // Cek apakah admin

  return (
    <header 
      className={`fixed top-0 left-0 w-full bg-white transition-all duration-300 z-50 
      ${isSticky ? 'shadow-md py-2' : 'py-4'}`} 
    >
      <div className="container mx-auto px-4 max-w-7xl flex items-center gap-4">
        
        {/* Logo */}
        <Link 
          href="/" 
          className="text-2xl font-extrabold text-indigo-700 shrink-0 tracking-tight hover:opacity-90 transition-opacity"
        >
          TOKO OXI
        </Link>
        
        {/* Navigation */}
        <nav className="hidden lg:flex items-center gap-7 ml-8 text-sm">
          <Link 
            href="/#products" 
            className="font-bold text-slate-800 hover:text-indigo-600 transition-colors"
          >
            Katalog Produk
          </Link>
          <Link 
            href="/contact" 
            className="text-slate-600 hover:text-indigo-600 transition-colors"
          >
            Kontak Kami
          </Link>
          
          {/* Admin Dashboard Link - Hanya untuk admin */}
          {isAdmin && (
            <Link 
              href="/#admin" 
              className="text-slate-600 hover:text-blue-600 transition-colors font-medium"
            >
              Dashboard Admin
            </Link>
          )}
          
          {/* Riwayat hanya untuk customer */}
          {isCustomer && (
            <Link 
              href="/profile/orders" 
              className="text-slate-600 hover:text-indigo-600 transition-colors"
            >
              Riwayat Saya
            </Link>
          )}
        </nav>
        
        {/* Search Bar */}
        <form 
          onSubmit={handleSearch}
          className="ml-auto grow max-w-xs relative hidden sm:block mr-4"
        >
          <input 
            type="text" 
            placeholder="Cari produk..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-gray-200 p-2 pl-10 text-sm rounded-full bg-gray-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
          />
          <button 
            type="submit" 
            className="absolute left-3 top-1/2 transform -translate-y-1/2"
            aria-label="Search"
          >
            <Search className="w-4 h-4 text-gray-400 hover:text-indigo-600 transition-colors" />
          </button>
        </form>
        
        {/* Header Actions */}
        <HeaderActionsClient 
          isLoggedIn={isLoggedIn}
          userName={userName}
          userPoints={userPoints}
          userType={type} // Tambahkan userType
        />
      </div>
    </header>
  );
};

export default Header;