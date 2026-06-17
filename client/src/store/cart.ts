import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
  cakeId: string;
  cakeName: string;
  imageUrl: string;
  variantId: string | null;
  variantName: string | null;
  unitPrice: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (cakeId: string, variantId: string | null) => void;
  updateQuantity: (cakeId: string, variantId: string | null, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  total: () => number;
  itemCount: () => number;
}

function isSameItem(item: CartItem, cakeId: string, variantId: string | null): boolean {
  return item.cakeId === cakeId && item.variantId === variantId;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (incoming) => {
        set((state) => {
          const existing = state.items.find((i) =>
            isSameItem(i, incoming.cakeId, incoming.variantId)
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                isSameItem(i, incoming.cakeId, incoming.variantId)
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
              isOpen: true,
            };
          }
          return { items: [...state.items, { ...incoming, quantity: 1 }], isOpen: true };
        });
      },

      removeItem: (cakeId, variantId) =>
        set((state) => ({
          items: state.items.filter((i) => !isSameItem(i, cakeId, variantId)),
        })),

      updateQuantity: (cakeId, variantId, quantity) => {
        if (quantity < 1) {
          get().removeItem(cakeId, variantId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            isSameItem(i, cakeId, variantId) ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),

      total: () => get().items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),
      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    {
      name: 'slice-cart',
      storage: createJSONStorage(() => localStorage),
      // Only persist items, not UI state
      partialize: (state) => ({ items: state.items }),
    }
  )
);
