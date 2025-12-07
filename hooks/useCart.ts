// hooks/useCart.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  category?: string; // Opsional: biar keren di tampilan
}

interface CartStore {
  items: CartItem[];
  addItem: (product: CartItem) => void;
  decreaseItem: (productId: string) => void; // Fungsi Baru: Kurangi Qty
  removeItem: (productId: string) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      // Tambah Item (+1)
      addItem: (product) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.id === product.id);

        if (existingItem) {
          set({
            items: currentItems.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({
            items: [...currentItems, { ...product, quantity: 1 }],
          });
        }
      },

      // Kurangi Item (-1)
      decreaseItem: (productId) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.id === productId);

        if (existingItem && existingItem.quantity > 1) {
          set({
            items: currentItems.map((item) =>
              item.id === productId
                ? { ...item, quantity: item.quantity - 1 }
                : item
            ),
          });
        } else {
          // Opsional: Kalau qty 1 dikurangin, mau dihapus atau diam?
          // Di sini kita biarkan diam di 1, user harus klik tombol sampah untuk hapus.
        }
      },

      removeItem: (productId) => {
        set({
          items: get().items.filter((item) => item.id !== productId),
        });
      },

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
      totalPrice: () => get().items.reduce((total, item) => total + (item.price * item.quantity), 0),
    }),
    {
      name: 'cart-storage',
    }
  )
);