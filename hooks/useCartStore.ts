// hooks/useCartStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItemType } from '@prisma/client';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  imageUrl?: string | null;
  quantity: number;
  itemType: CartItemType;
  // Field tambahan (opsional)
  startDate?: string;
  endDate?: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  totalItems: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (newItem) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((i) => i.productId === newItem.productId);

        if (existingItem) {
          // Jika produk sudah ada, tambah quantity
          set({
            items: currentItems.map((i) =>
              i.productId === newItem.productId
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          });
        } else {
          // Jika belum ada, masukkan baru
          set({ items: [...currentItems, newItem] });
        }
      },

      removeItem: (productId) => {
        set({ items: get().items.filter((i) => i.productId !== productId) });
      },

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((acc, item) => acc + item.quantity, 0),
    }),
    {
      name: 'sikerent-guest-cart', // Nama key di LocalStorage
    }
  )
);