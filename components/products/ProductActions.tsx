'use client';

import React, { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import { ShoppingCart, Heart, Share2 } from 'lucide-react';

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
  const addItem = useCart((state) => state.addItem);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl || undefined,
      category: product.categoryName,
    });
    
    // Efek visual tombol berubah sebentar
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="mt-8 space-y-4">
      {/* Tombol Sewa Utama */}
      <div className="flex gap-4">
        <button
          onClick={handleAddToCart}
          disabled={product.stock <= 0 || isAdded}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-bold text-lg transition-all
            ${product.stock > 0 
              ? (isAdded ? 'bg-green-600 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-indigo-200')
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
          `}
        >
          <ShoppingCart className="w-5 h-5" />
          {product.stock > 0 ? (isAdded ? 'Berhasil Masuk Keranjang' : 'Sewa Sekarang') : 'Stok Habis'}
        </button>

        <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-500 hover:text-red-500 transition-colors">
          <Heart className="w-6 h-6" />
        </button>
      </div>

      {/* Info Tambahan */}
      <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
        <span>Kategori: <span className="text-indigo-600 font-medium">{product.categoryName}</span></span>
        <button className="flex items-center gap-1 hover:text-indigo-600">
          <Share2 className="w-4 h-4" /> Share
        </button>
      </div>
    </div>
  );
}