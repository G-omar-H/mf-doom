import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem, Product } from '@/types'

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem: (product: Product, quantity?: number, variants?: Record<string, string>) => void
  removeItem: (productId: string, variants?: Record<string, string>) => void
  updateQuantity: (productId: string, quantity: number, variants?: Record<string, string>) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
  toggleCart: () => void
  setIsOpen: (isOpen: boolean) => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      
      addItem: (product, quantity = 1, variants) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) => item.product.id === product.id && 
            JSON.stringify(item.selectedVariants) === JSON.stringify(variants)
          )
          
          if (existingItemIndex > -1) {
            const newItems = [...state.items]
            newItems[existingItemIndex].quantity += quantity
            return { items: newItems }
          }
          
          return {
            items: [...state.items, { product, quantity, selectedVariants: variants }]
          }
        })
      },
      
      removeItem: (productId, variants) => {
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.product.id === productId && 
            JSON.stringify(item.selectedVariants) === JSON.stringify(variants))
          )
        }))
      },
      
      updateQuantity: (productId, quantity, variants) => {
        if (quantity <= 0) {
          get().removeItem(productId, variants)
          return
        }
        
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId && 
            JSON.stringify(item.selectedVariants) === JSON.stringify(variants)
              ? { ...item, quantity }
              : item
          )
        }))
      },
      
      clearCart: () => set({ items: [] }),
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },
      
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.product.price * item.quantity), 0)
      },
      
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      
      setIsOpen: (isOpen) => set({ isOpen })
    }),
    {
      name: 'mf-doom-cart',
    }
  )
) 