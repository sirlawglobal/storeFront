'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { X, ShoppingBag, Tag } from 'lucide-react';
import { useCartStore } from '@/store/cart.store';
import { Button } from '../ui/Button';
import { CartItem } from './CartItem';
import { api } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { Cart } from '@/types';

export const CartDrawer = () => {
  const { isOpen, closeCart, cart, setCart, itemCount } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');
  const router = useRouter();

  // Load fresh cart data whenever drawer opens
  useEffect(() => {
    if (isOpen) {
      loadCart();
    }
  }, [isOpen]);

  const loadCart = async () => {
    setIsLoading(true);
    try {
      const res = await api.cart.get();
      // The interceptor returns the full body: { message, data: Cart }
      const cartData = res?.data ?? res;
      if (cartData && Array.isArray(cartData.items)) {
        setCart(cartData as Cart);
      }
    } catch (err) {
      console.error('Failed to load cart', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateQuantity = async (sku: string, quantity: number) => {
    try {
      const res = await api.cart.updateItem(sku, { quantity });
      const cartData = res?.data ?? res;
      if (cartData && Array.isArray(cartData.items)) setCart(cartData as Cart);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemove = async (sku: string) => {
    try {
      const res = await api.cart.removeItem(sku);
      const cartData = res?.data ?? res;
      if (cartData && Array.isArray(cartData.items)) setCart(cartData as Cart);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    setCouponError('');
    try {
      const res: any = await api.cart.applyCoupon(couponInput.trim().toUpperCase());
      const cartData = res?.data ?? res;
      if (cartData && Array.isArray(cartData.items)) setCart(cartData as Cart);
      setCouponInput('');
    } catch (err: any) {
      setCouponError(err.message || 'Invalid coupon');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = async () => {
    setCouponLoading(true);
    setCouponError('');
    try {
      const res: any = await api.cart.removeCoupon();
      const cartData = res?.data ?? res;
      if (cartData && Array.isArray(cartData.items)) setCart(cartData as Cart);
    } catch (err: any) {
      setCouponError(err.message || 'Failed to remove coupon');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleCheckout = () => {
    closeCart();
    router.push('/checkout');
  };

  // Close on Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') closeCart(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [closeCart]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 transition-opacity" onClick={closeCart} />
      
      <div className="fixed inset-y-0 right-0 w-full md:w-[400px] bg-white z-50 flex flex-col shadow-2xl transform transition-transform duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-gray-50">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-primary" />
            <h2 className="font-playfair text-xl font-bold">Your Cart</h2>
            <span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full ml-1">
              {itemCount}
            </span>
          </div>
          <button onClick={closeCart} className="p-2 text-text-secondary hover:text-primary rounded-full hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>

        {/* Cart Items Area */}
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading && !cart ? (
            <div className="flex justify-center items-center h-40 text-text-secondary">Loading cart...</div>
          ) : !cart || cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-10">
              <ShoppingBag size={48} className="text-gray-200 mb-4" />
              <p className="text-lg font-medium text-text-primary mb-2">Your cart is empty</p>
              <p className="text-sm text-text-secondary mb-6">Looks like you haven&apos;t added any products yet.</p>
              <Button onClick={closeCart}>Continue Shopping</Button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {cart.items.map(item => (
                <CartItem 
                  key={item.sku} 
                  item={item} 
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={handleRemove}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer / Summary */}
        {cart && cart.items.length > 0 && (
          <div className="p-4 border-t border-border bg-gray-50">
            {/* Promo Coupon Form */}
            <div className="mb-3 pb-3 border-b border-border">
              {cart.couponCode ? (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg text-xs">
                  <div className="flex items-center gap-1.5">
                    <Tag size={14} className="text-success" />
                    <span className="font-bold text-green-800 uppercase">{cart.couponCode}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    disabled={couponLoading}
                    className="text-error font-medium hover:underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-1.5">
                  <input
                    type="text"
                    placeholder="Coupon code"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="input-base text-xs uppercase py-1.5 px-2 flex-1"
                  />
                  <Button type="submit" size="sm" className="px-3 py-1.5 text-xs" isLoading={couponLoading}>
                    Apply
                  </Button>
                </form>
              )}
              {couponError && <p className="text-[11px] text-error mt-1">{couponError}</p>}
            </div>

            <div className="flex justify-between items-center mb-2">
              <span className="text-text-secondary">Subtotal</span>
              <span className="font-medium">{formatPrice(cart.subtotal)}</span>
            </div>
            {cart.totalDiscount > 0 && (
              <div className="flex justify-between items-center mb-2 text-success">
                <span>Discount</span>
                <span>-{formatPrice(cart.totalDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between items-center mb-4">
              <span className="text-text-secondary">Tax</span>
              <span>{formatPrice(cart.taxAmount)}</span>
            </div>
            
            <div className="flex justify-between items-center mb-6 pt-3 border-t border-gray-200">
              <span className="font-semibold text-lg">Total</span>
              <span className="font-bold text-xl text-primary">{formatPrice(cart.totalAmount)}</span>
            </div>

            <Button className="w-full text-lg shadow-md" size="lg" onClick={handleCheckout}>
              Checkout Securely
            </Button>
            
            <div className="mt-3 text-center">
              <Link href="/cart" onClick={closeCart} className="text-sm text-text-secondary hover:text-primary underline">
                View Full Cart
              </Link>
            </div>
          </div>
        )}

      </div>
    </>
  );
};
