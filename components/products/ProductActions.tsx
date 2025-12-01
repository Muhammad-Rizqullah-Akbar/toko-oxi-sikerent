'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { ShoppingCart, Heart, Share2, Plus, Minus, CheckCircle2 } from 'lucide-react';

interface ProductActionsProps {
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl: string | null;
    categoryName: string;
    stock: number;
  };
}

export default function ProductActions({ product }: ProductActionsProps) {
  const { addItem, items } = useCart();
  const { addItem: addWishlist, removeItem: removeWishlist, isInWishlist } = useWishlist();
  
  const [isAdded, setIsAdded] = useState(false);
  const [qty, setQty] = useState(1);
  const [mounted, setMounted] = useState(false);
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');

  // Hydration Fix
  useEffect(() => {
    // [FIX 1] Abaikan peringatan ESLint (wajib untuk fix hydration)
    // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Cek apakah produk ini sudah ada di cart? Berapa jumlahnya?
  const existingCartItem = items.find((item) => item.id === product.id);
  const cartQty = existingCartItem ? existingCartItem.quantity : 0;

  // Cek status wishlist
  const isLoved = mounted ? isInWishlist(product.id) : false;

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl || undefined,
      category: product.categoryName,
      quantity: qty, 
    });
    
    setQty(1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleWishlistToggle = () => {
    if (isLoved) {
      removeWishlist(product.id);
    } else {
      addWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        category: product.categoryName
      });
    }
  };

  // --- FUNGSI SHARE ---
  const handleShare = async () => {
    const shareUrl = window.location.href;
    const priceFormatted = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(product.price);
    const shareText = `Sewa ${product.name} cuma ${priceFormatted} di TOKO OXI! Cek sekarang:`;

    if (navigator.share) {
        // OPSI 1: Web Share API
        try {
            await navigator.share({
                title: product.name,
                text: shareText,
                url: shareUrl,
            });
            setShareStatus('idle'); 
        } catch (_error) { // [FIX 2] Mengganti 'error' menjadi '_error'
            console.log('Sharing failed or cancelled:', _error); 
            setShareStatus('idle'); 
        }
    } else {
        // OPSI 2: Fallback ke Copy to Clipboard
        try {
            await navigator.clipboard.writeText(shareText + ' ' + shareUrl);
            setShareStatus('copied'); 
            setTimeout(() => setShareStatus('idle'), 2000);
        } catch (_err) { // [FIX 3] Mengganti 'err' menjadi '_err'
            alert('Gagal menyalin link. Silakan salin URL dari address bar.');
        }
    }
  };


  if (!mounted) return null;

  return (
    <div className="space-y-6">
      
      {/* --- KONTROL JUMLAH & CART STATUS --- */}
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1 border border-gray-200">
            <button 
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm text-gray-600 hover:text-indigo-600 disabled:opacity-50 transition"
                disabled={qty <= 1}
            >
                <Minus size={14} />
            </button>
            <span className="w-8 text-center font-bold text-gray-800">{qty}</span>
            <button 
                onClick={() => setQty(prev => prev + 1)}
                className="w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm text-gray-600 hover:text-indigo-600 disabled:opacity-50 transition"
                disabled={product.stock <= 0}
            >
                <Plus size={14} />
            </button>
         </div>

         {/* Indikator Counter Cart */}
         {cartQty > 0 && (
             <div className="flex items-center gap-1.5 text-sm font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-full border border-green-100 animate-in fade-in zoom-in">
                 <CheckCircle2 size={16} />
                 <span>{cartQty} di Keranjang</span>
             </div>
         )}
      </div>

      {/* --- TOMBOL AKSI UTAMA --- */}
      <div className="flex gap-3">
        <button
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
          className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl active:scale-[0.98]
            ${isAdded 
                ? 'bg-green-600 text-white shadow-green-200' 
                : product.stock > 0 
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'}
          `}
        >
          {isAdded ? (
              <> <CheckCircle2 className="w-5 h-5" /> Berhasil Ditambah </>
          ) : product.stock > 0 ? (
              <> <ShoppingCart className="w-5 h-5" /> Sewa Sekarang </>
          ) : (
              'Stok Habis'
          )}
        </button>

        {/* Tombol Love (Wishlist) */}
        <button 
            onClick={handleWishlistToggle}
            className={`p-3.5 rounded-xl border-2 transition-all active:scale-95 group ${isLoved ? 'border-red-200 bg-red-50 text-red-500' : 'border-gray-200 hover:border-red-200 hover:bg-red-50 text-gray-400 hover:text-red-500'}`}
            title={isLoved ? "Hapus dari Wishlist" : "Simpan ke Wishlist"}
        >
          <Heart className={`w-6 h-6 transition-all ${isLoved ? 'fill-red-500 scale-110' : 'group-hover:scale-110'}`} />
        </button>
      </div>

      {/* Info Tambahan & Share Button */}
      <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
        <span>Kategori: <span className="text-indigo-600 font-medium px-2 py-0.5 bg-indigo-50 rounded uppercase text-xs tracking-wide">{product.categoryName}</span></span>
        
        {/* FUNGSI SHARE */}
        <button 
            onClick={handleShare}
            className={`flex items-center gap-1.5 transition-colors font-medium 
                ${shareStatus === 'copied' ? 'text-green-600' : 'hover:text-indigo-600'}`}
        >
          {shareStatus === 'copied' ? (
              <> <CheckCircle2 className="w-4 h-4" /> Disalin! </>
          ) : (
              <> <Share2 className="w-4 h-4" /> Share </>
          )}
        </button>
      </div>
    </div>
  );
}