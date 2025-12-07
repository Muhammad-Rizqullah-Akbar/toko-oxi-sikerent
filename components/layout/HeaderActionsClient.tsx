// components/layout/HeaderActionsClient.tsx (UPDATE)

'use client';
import { ShoppingCart, Heart, User, LogOut, Package, Award, ChevronDown, Settings, Shield } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import React, { useState, useRef, useEffect } from 'react';
import { signOut } from '@/lib/auth-client-utils';

interface HeaderActionsClientProps {
  isLoggedIn: boolean;
  userName: string | null | undefined;
  userPoints?: number;
  userType?: 'user' | 'customer' | null; // Tambah userType
}

export function HeaderActionsClient({ 
  isLoggedIn, 
  userName, 
  userPoints = 0,
  userType = null 
}: HeaderActionsClientProps) {
  const cartItems = useCart((state) => state.items);
  const wishlistItems = useWishlist((state) => state.items);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOut({ redirectTo: '/' });
  };

  const cartCount = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
  const firstName = userName?.split(' ')[0] || 'Customer';
  const isCustomer = userType === 'customer';
  const isUser = userType === 'user';

  return (
    <div className="flex items-center gap-2 sm:gap-4 shrink-0">
      
      {/* Cart & Wishlist - Hanya untuk customer */}
      {isCustomer && (
        <>
          <Link 
            href="/wishlist" 
            className="p-2 rounded-full hover:bg-gray-100 transition-colors relative group"
            aria-label="Wishlist"
          >
            <Heart className="w-6 h-6 text-gray-600 group-hover:text-red-500 transition-colors" />
            {wishlistItems.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold flex items-center justify-center rounded-full ring-2 ring-white">
                {wishlistItems.length}
              </span>
            )}
          </Link>

          <Link 
            href="/cart" 
            className="p-2 rounded-full hover:bg-gray-100 transition-colors relative group"
            aria-label="Shopping Cart"
          >
            <ShoppingCart className="w-6 h-6 text-gray-600 group-hover:text-indigo-600 transition-colors" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-600 text-white text-xs font-bold flex items-center justify-center rounded-full ring-2 ring-white">
                {cartCount}
              </span>
            )}
          </Link>
        </>
      )}
      
      {/* User Dropdown */}
      <div className="relative" ref={dropdownRef}>
        {isLoggedIn ? (
          <div className="flex items-center gap-3">
            {/* Points Badge - Hanya untuk customer */}
            {isCustomer && userPoints > 0 && (
              <div className="hidden lg:flex items-center gap-1 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full border border-amber-200">
                <Award className="w-4 h-4" />
                <span className="text-sm font-bold">{userPoints.toLocaleString('id-ID')}</span>
                <span className="text-xs">pts</span>
              </div>
            )}

            {/* User Avatar & Dropdown Toggle */}
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="User menu"
              aria-expanded={showDropdown}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                isUser ? 'bg-blue-100 text-blue-700' : 'bg-indigo-100 text-indigo-700'
              }`}>
                {firstName.charAt(0).toUpperCase()}
                {isUser && <Shield className="w-3 h-3 absolute -top-1 -right-1 text-blue-500" />}
              </div>
              <span className="hidden md:inline text-sm font-medium text-slate-700">
                Hi, {firstName}
                {isUser && <span className="text-xs text-blue-600 ml-1">(Staff)</span>}
              </span>
              <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                {/* User Info */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-slate-800 truncate">{userName}</p>
                    {isUser && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                        Staff
                      </span>
                    )}
                  </div>
                  {isCustomer && (
                    <div className="flex items-center gap-1 mt-1">
                      <Award className="w-4 h-4 text-amber-500" />
                      <span className="text-sm text-amber-600 font-bold">
                        {userPoints.toLocaleString('id-ID')} points
                      </span>
                    </div>
                  )}
                </div>

                {/* Menu Items */}
                <div className="py-1">
                  {/* Profile Link */}
                  {isCustomer ? (
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                      onClick={() => setShowDropdown(false)}
                    >
                      <User className="w-4 h-4" />
                      <span>Profil Saya</span>
                    </Link>
                  ) : (
                    <Link
                      href="/admin"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                      onClick={() => setShowDropdown(false)}
                    >
                      <Shield className="w-4 h-4" />
                      <span>Dashboard Admin</span>
                    </Link>
                  )}
                  
                  {/* Orders Link - Hanya untuk customer */}
                  {isCustomer && (
                    <Link
                      href="/profile/order"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                      onClick={() => setShowDropdown(false)}
                    >
                      <Package className="w-4 h-4" />
                      <span>Pesanan Saya</span>
                    </Link>
                  )}
                  
                  {/* Wishlist - Hanya untuk customer */}
                  {isCustomer && (
                    <Link
                      href="/wishlist"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                      onClick={() => setShowDropdown(false)}
                    >
                      <Heart className="w-4 h-4" />
                      <span>Wishlist Saya</span>
                    </Link>
                  )}
                  
                  {/* Settings */}
                  <Link
                    href={isCustomer ? "/profile/edit" : "/admin/settings"}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-gray-50 hover:text-slate-900 transition-colors"
                    onClick={() => setShowDropdown(false)}
                  >
                    <Settings className="w-4 h-4" />
                    <span>Pengaturan</span>
                  </Link>
                </div>

                {/* Logout */}
                <div className="border-t border-gray-100 pt-1">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Keluar</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="text-sm text-slate-600 hover:text-indigo-600 font-medium px-3 py-1.5 rounded-full hover:bg-indigo-50 transition-colors"
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className="bg-indigo-600 text-white text-sm font-bold py-2 px-5 rounded-full hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200 hover:shadow-lg"
            >
              Daftar
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}