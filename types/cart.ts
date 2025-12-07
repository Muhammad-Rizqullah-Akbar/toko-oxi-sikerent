// types/cart.ts
import { CartItemType } from "@prisma/client"

// Struktur data item cart di LocalStorage (Guest)
export interface LocalCartItem {
  productId: string
  quantity: number
  itemType: CartItemType
  startDate?: string // string karena di localstorage tidak ada object Date
  endDate?: string
  fileUrl?: string
  serviceType?: string
  pageCount?: number
  notes?: string
}