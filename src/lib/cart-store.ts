import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ProductItem, Currency } from "@/types";

export interface CartItem {
  product: ProductItem;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  currency: Currency;
  usdRate: number;
  addItem: (product: ProductItem, quantity?: number) => boolean;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setCurrency: (currency: Currency) => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      currency: "NPR",
      usdRate: 135.0,

      addItem: (product, quantity = 1) => {
        if (!Number.isInteger(quantity) || quantity < 1 || product.stock < 1) {
          return false;
        }
        const currentItems = get().items;
        const existingIndex = currentItems.findIndex(
          (item) => item.product.id === product.id,
        );

        if (existingIndex > -1) {
          const updated = [...currentItems];
          const newQty = updated[existingIndex].quantity + quantity;
          if (
            Number.isInteger(quantity) &&
            quantity > 0 &&
            newQty <= product.stock
          ) {
            updated[existingIndex].quantity = newQty;
            set({ items: updated });
            return true;
          }
          return false;
        } else if (quantity <= product.stock) {
          set({ items: [...currentItems, { product, quantity }] });
          return true;
        }
        return false;
      },

      removeItem: (productId) => {
        set({
          items: get().items.filter((item) => item.product.id !== productId),
        });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        const updated = get().items.map((item) => {
          if (item.product.id === productId) {
            const safeQty = Math.min(quantity, item.product.stock);
            return { ...item, quantity: safeQty };
          }
          return item;
        });
        set({ items: updated });
      },

      clearCart: () => {
        set({ items: [] });
      },

      setCurrency: (currency) => {
        set({ currency });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0,
        );
      },

      getTotal: () => {
        // Free shipping for orders or flat standard rate
        return get().getSubtotal();
      },
    }),
    {
      name: "rudrakart-cart-storage-v2",
    },
  ),
);
