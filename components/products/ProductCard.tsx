'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Star, Check, Plus, Minus, Trash2, CheckCircle2 } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useSession } from 'next-auth/react'; // [BARU] Cek Login
import { addToCartDB, updateCartItemQuantity } from '@/app/actions/cart'; // [BARU] Server Actions
import { CartItemType } from '@prisma/client'; // [BARU] Enum Type

const DEMO_IMAGES = {
  kamera: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  cetak: "https://images.unsplash.com/photo-1589561084771-04cf8b066063?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  papan: "https://images.unsplash.com/photo-1527518084957-4f722457c604?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  drone: "https://images.unsplash.com/photo-1574315042633-89d04f66a6a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  audio: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  projector: "https://images.unsplash.com/photo-1623631915362-0c0303305135?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  default: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
};

type ProductCardProps = {
  id: string;
  name: string;
  price: number;
  imageUrl: string | null;
  categoryName?: string;
};

export default function ProductCard({ id, name, price, imageUrl, categoryName }: ProductCardProps) {
  const { data: session } = useSession(); // [BARU] Ambil sesi user
  const { items, addItem, removeItem, decreaseItem } = useCart(); 
  const [isLoading, setIsLoading] = useState(true);
  
  // State Popup
  const [showQtyPopup, setShowQtyPopup] = useState(false);
  const [qtyDisplay, setQtyDisplay] = useState(1); 

  const cartItem = useMemo(() => items.find((item) => item.id === id), [items, id]);
  const isInCart = Boolean(cartItem);

  // --- Logic Gambar & Badge ---
  const getDemoImageByName = (productName: string) => {
    const lowerName = productName.toLowerCase();
    if (lowerName.includes('kamera') || lowerName.includes('cam')) return DEMO_IMAGES.kamera;
    if (lowerName.includes('cetak') || lowerName.includes('spanduk') || lowerName.includes('banner')) return DEMO_IMAGES.cetak;
    if (lowerName.includes('papan') || lowerName.includes('nama')) return DEMO_IMAGES.papan;
    if (lowerName.includes('drone')) return DEMO_IMAGES.drone;
    if (lowerName.includes('sound') || lowerName.includes('mic') || lowerName.includes('speaker')) return DEMO_IMAGES.audio;
    if (lowerName.includes('proyektor')) return DEMO_IMAGES.projector;
    return DEMO_IMAGES.default;
  };

  const displayImage = imageUrl || getDemoImageByName(name);
  const isPrinting = categoryName ? (categoryName.toLowerCase().includes('cetak') || name.toLowerCase().includes('cetak')) : false;
  const badgeColor = isPrinting ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700';

  // --- HANDLER UTAMA (Add New) ---
  const handleMainButtonClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isInCart) {
      // Jika sudah ada, buka popup edit jumlah
      if (cartItem) {
        setQtyDisplay(cartItem.quantity);
      }
      setShowQtyPopup(true); 
    } else {
      // 1. Update UI Local (Optimistic)
      addItem({ id, name, price, imageUrl: displayImage, category: categoryName || 'Umum', quantity: 1 });
      
      // 2. [HYBRID] Jika Login, Simpan ke DB
      if (session?.user) {
        try {
          await addToCartDB({
            productId: id,
            quantity: 1,
            itemType: CartItemType.PRODUCT, // Default type
          });
        } catch (error) {
          console.error("Gagal sync ke DB:", error);
          // Opsional: Revert state local jika DB gagal (jarang dilakukan utk UX speed)
        }
      }
    }
  };

  // --- LOGIC UPDATE KERANJANG (Edit Qty via Popup) ---
  const handleUpdateCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!cartItem) return;

    // --- A. LOGIC UI LOCAL (ZUSTAND) ---
    // Tetap jalankan ini agar UI responsif instan
    if (qtyDisplay === 0) {
      removeItem(id);
    } else {
      const diff = qtyDisplay - cartItem.quantity;
      if (diff > 0) {
        addItem({ id, name, price, imageUrl: displayImage, category: categoryName || 'Umum', quantity: diff });
      } else if (diff < 0) {
        for (let i = 0; i < Math.abs(diff); i++) {
          decreaseItem(id);
        }
      }
    }

    // --- B. [HYBRID] LOGIC DATABASE ---
    // Kirim final quantity (qtyDisplay) ke server
    if (session?.user) {
      try {
         // Kita pakai fungsi khusus update quantity biar aman, bukan add lagi
         await updateCartItemQuantity(id, qtyDisplay);
      } catch (error) {
         console.error("Gagal update qty DB:", error);
      }
    }

    setShowQtyPopup(false);
  };

  const stopProp = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <Link href={`/product/${id}`} className="group block h-full relative">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-100 transition-all duration-300 h-full flex flex-col overflow-hidden relative">
        
        {/* Image Container */}
        <div className="relative aspect-square bg-slate-100 overflow-hidden">
          <Image
            src={displayImage}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={`object-cover group-hover:scale-110 transition-all duration-700 ease-in-out ${isLoading ? 'scale-110 blur-lg grayscale' : 'scale-100 blur-0 grayscale-0'}`}
            onLoad={() => setIsLoading(false)}
          />
          
          {categoryName && (
            <div className="absolute top-3 left-3 z-10 pointer-events-none">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md shadow-sm ${badgeColor}`}>
                    {isPrinting ? 'Percetakan' : 'Sewa / Rental'}
                </span>
            </div>
          )}

          {/* --- POP-UP MANAJEMEN JUMLAH --- */}
          {showQtyPopup && (
             <div 
               className="absolute inset-0 bg-white/95 backdrop-blur-sm z-20 flex flex-col items-center justify-center animate-in fade-in duration-200"
               onClick={stopProp}
             >
                <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">
                    {qtyDisplay === 0 ? 'Hapus Barang?' : 'Atur Jumlah'}
                </p>
                
                <div className="flex items-center gap-3 mb-4 bg-slate-100 rounded-full p-1">
                    <button 
                        onClick={(e) => { stopProp(e); setQtyDisplay(prev => Math.max(0, prev - 1)); }}
                        className={`w-8 h-8 flex items-center justify-center rounded-full shadow-sm transition ${qtyDisplay === 1 ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-white text-slate-600 hover:text-indigo-600'}`}
                    >
                        {qtyDisplay <= 1 ? <Trash2 size={14} /> : <Minus size={14} />}
                    </button>
                    
                    <span className={`font-bold text-lg w-8 text-center transition-colors ${qtyDisplay === 0 ? 'text-red-500' : 'text-slate-800'}`}>
                        {qtyDisplay}
                    </span>
                    
                    <button 
                         onClick={(e) => { stopProp(e); setQtyDisplay(prev => prev + 1); }}
                         className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm text-slate-600 hover:text-indigo-600 active:scale-90 transition"
                    >
                        <Plus size={14} />
                    </button>
                </div>

                <div className="flex gap-2">
                    <button 
                        onClick={() => setShowQtyPopup(false)}
                        className="px-4 py-2 rounded-lg bg-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-300 transition"
                    >
                        Batal
                    </button>
                    <button 
                        onClick={handleUpdateCart}
                        className={`px-4 py-2 rounded-lg text-white text-xs font-bold shadow-md transition flex items-center gap-1 ${qtyDisplay === 0 ? 'bg-red-500 hover:bg-red-600 shadow-red-200' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'}`}
                    >
                        {qtyDisplay === 0 ? (
                             <> <Trash2 size={14} /> Hapus </>
                        ) : (
                             <> <Check size={14} /> Simpan </>
                        )}
                    </button>
                </div>
             </div>
          )}

          {/* Tombol Keranjang Utama */}
          {!showQtyPopup && (
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-end p-4 justify-end pointer-events-none">
                <button
                    onClick={handleMainButtonClick}
                    className={`p-2.5 rounded-full shadow-lg transform transition-all duration-300 flex items-center justify-center pointer-events-auto
                        ${isInCart 
                            ? 'bg-green-500 text-white translate-y-0 opacity-100 scale-100 hover:scale-110 hover:bg-green-600' 
                            : 'bg-white text-indigo-600 hover:bg-indigo-600 hover:text-white translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100'
                        }
                    `}
                >
                    {isInCart ? <Check size={20} strokeWidth={3} /> : <ShoppingCart size={20} />}
                </button>
            </div>
          )}
        </div>

        {/* Content Produk */}
        <div className="p-4 flex flex-col grow">
          <h3 className="text-slate-800 font-bold text-sm sm:text-base mb-1 line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors">
            {name}
          </h3>
          <div className="flex items-center gap-1 mb-3">
            <Star size={12} className="fill-yellow-400 text-yellow-400" />
            <span className="text-xs text-slate-400">4.9 (12)</span>
          </div>
          <div className="mt-auto pt-3 border-t border-slate-50 flex items-center justify-between">
            <div>
                <p className="text-xs text-slate-400 font-medium">Mulai dari</p>
                <p className="text-indigo-600 font-bold text-lg">
                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price)}
                </p>
            </div>
             {isInCart && (
                 <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100 flex items-center gap-1">
                     <CheckCircle2 size={10} /> {cartItem?.quantity} pcs
                 </span>
             )}
          </div>
        </div>
      </div>
    </Link>
  );
}