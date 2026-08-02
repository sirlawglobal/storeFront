import { create } from 'zustand';
import { Cart, CartItem } from '@/types';

interface CartState {
  cart: Cart | null;
  isOpen: boolean; // For drawer
  setCart: (cart: Cart) => void;
  openCart: () => void;
  closeCart: () => void;
  clearCart: () => void;
  itemCount: number;
}

export const useCartStore = create<CartState>((set) => ({
  cart: null,
  isOpen: false,
  setCart: (cart) => set({ 
    cart, 
    itemCount: cart.items.reduce((acc, item) => acc + item.quantity, 0) 
  }),
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  clearCart: () => set({ cart: null, itemCount: 0 }),
  itemCount: 0,
}));
