import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  toppings?: string[];
}

export interface CartOffer {
  id: string; // unique cart id for the configured offer
  offerId: string;
  name: string;
  price: number; // configured total price
  quantity: number;
  imageUrl?: string;
  customOptions: string[];
}

interface CartStore {
  items: CartItem[];
  offers: CartOffer[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  addOffer: (offer: CartOffer) => void;
  removeOffer: (id: string) => void;
  updateOfferQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  errors: string[];
  setErrors: (errors: string[]) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      offers: [],
      errors: [],
      setErrors: (errors) => set({ errors }),
      addItem: (item) => {
        const existingItem = get().items.find((i) => i.id === item.id);
        if (existingItem) {
          set({
            items: get().items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          });
        } else {
          set({ items: [...get().items, { ...item, quantity: 1 }] });
        }
      },
      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
      },
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, quantity } : i
          ),
        });
      },
      addOffer: (offer) => {
        set({ offers: [...get().offers, offer] });
      },
      removeOffer: (id) => {
        set({ offers: get().offers.filter((o) => o.id !== id) });
      },
      updateOfferQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeOffer(id);
          return;
        }
        set({
          offers: get().offers.map((o) =>
            o.id === id ? { ...o, quantity } : o
          ),
        });
      },
      clearCart: () => set({ items: [], offers: [] }),
      getTotal: () => {
        const itemsTotal = get().items.reduce((acc, item) => acc + item.price * item.quantity, 0);
        const offersTotal = get().offers.reduce((acc, offer) => acc + offer.price * offer.quantity, 0);
        return itemsTotal + offersTotal;
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
