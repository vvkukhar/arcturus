import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { trackEcommerce } from '../analytics';
import { api } from '../api';

export interface CartItem {
  id: string;
  title: string;
  price: number;
  imageUrl?: string;
  theme?: string;
  condition?: string;
  quantity: number;
  maxQuantity?: number;
}

interface CartStore {
  items: CartItem[];
  isCartOpen: boolean;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  setIsCartOpen: (isOpen: boolean) => void;
  addItem: (item: Omit<CartItem, 'quantity' | 'maxQuantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  validateStock: () => Promise<void>;
  totalItems: number;
  totalPrice: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,
      _hasHydrated: false,
      totalItems: 0,
      totalPrice: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      setHasHydrated: (state) => {
        set({ _hasHydrated: state });
        if (state) get().validateStock();
      },
      setIsCartOpen: (isOpen) => set({ isCartOpen: isOpen }),
      addItem: (item) => {
        const currentItems = get().items;
        const existingIndex = currentItems.findIndex((i) => i.id === item.id);
        
        if (existingIndex > -1) {
          const existing = currentItems[existingIndex];
          if (existing.maxQuantity && existing.quantity >= existing.maxQuantity) return;
          const newItems = [...currentItems];
          newItems[existingIndex] = { ...existing, quantity: existing.quantity + 1 };
          set({ items: newItems, isCartOpen: true, totalItems: newItems.reduce((sum, i) => sum + i.quantity, 0) });
        } else {
          trackEcommerce('add_to_cart', {
            currency: 'UAH',
            value: item.price,
            items: [{ item_id: item.id, item_name: item.title, price: item.price, item_category: item.theme, quantity: 1 }]
          });
          const newItems = [...currentItems, { ...item, quantity: 1, maxQuantity: 1 }];
          set({ items: newItems, isCartOpen: true, totalItems: newItems.reduce((sum, i) => sum + i.quantity, 0) });
        }
      },
      removeItem: (id) => {
        const currentItems = get().items;
        const itemToRemove = currentItems.find((i) => i.id === id);
        if (!itemToRemove) return;

        const newItems = currentItems.filter((i) => i.id !== id);
        trackEcommerce('remove_from_cart', {
          currency: 'UAH',
          value: itemToRemove.price * itemToRemove.quantity,
          items: [{ item_id: id, item_name: itemToRemove.title, price: itemToRemove.price, quantity: itemToRemove.quantity }]
        });

        set({ items: newItems, totalItems: newItems.reduce((sum, i) => sum + i.quantity, 0) });
      },
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        const newItems = get().items.map((i) => {
          if (i.id === id) {
            return { ...i, quantity: i.maxQuantity ? Math.min(i.maxQuantity, quantity) : quantity };
          }
          return i;
        });
        set({ items: newItems, totalItems: newItems.reduce((sum, i) => sum + i.quantity, 0) });
      },
      clearCart: () => set({ items: [], totalItems: 0 }),
      validateStock: async () => {
        const currentItems = get().items;
        if (currentItems.length === 0) return;

        try {
          const ids = currentItems.map(i => i.id).join(',');
          const res = await api.get<any[]>(`/public/catalog?ids=${ids}`, { requireAuth: false });
          if (!Array.isArray(res)) return;

          const availableMap = new Map(res.map(r => [r.id, r.quantity]));
          const validatedItems = currentItems.filter(item => (availableMap.get(item.id) || 0) > 0).map(item => {
            const available = availableMap.get(item.id) || 0;
            return { ...item, quantity: Math.min(item.quantity, available), maxQuantity: available };
          });

          set({ items: validatedItems, totalItems: validatedItems.reduce((sum, i) => sum + i.quantity, 0) });
        } catch {}
      }
    }),
    {
      name: 'arcturus-cart',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) state.setHasHydrated(true);
      }
    }
  )
);