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
  setCart: (rawCart) => {
    if (!rawCart) return;
    const subTotal = (rawCart as any)?.subTotal ?? (rawCart as any)?.subtotal ?? 0;
    const discountAmount = (rawCart as any)?.discountAmount ?? (rawCart as any)?.totalDiscount ?? 0;

    const normalizedCart: Cart = {
      ...rawCart,
      subtotal: subTotal,
      subTotal: subTotal,
      totalDiscount: discountAmount,
      discountAmount: discountAmount,
    } as any;

    set({
      cart: normalizedCart,
      itemCount: normalizedCart.items?.reduce((acc, item) => acc + item.quantity, 0) ?? 0,
    });
  },
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  clearCart: () => set({ cart: null, itemCount: 0 }),
  itemCount: 0,
}));
