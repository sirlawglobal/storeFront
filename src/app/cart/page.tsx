'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, ArrowLeft, ShieldCheck, Truck } from 'lucide-react';
import { useCartStore } from '@/store/cart.store';
import { CartItem } from '@/components/cart/CartItem';
import { CouponInput } from '@/components/cart/CouponInput';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { Cart } from '@/types';

export default function CartPage() {
  const router = useRouter();
  const { cart, setCart, itemCount } = useCartStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    setIsLoading(true);
    try {
      const res = await api.cart.get();
      setCart(res.data as Cart);
    } catch (err) {
      console.error('Failed to load cart', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateQuantity = async (sku: string, quantity: number) => {
    try {
      const res = await api.cart.updateItem(sku, { quantity });
      setCart(res.data as Cart);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemove = async (sku: string) => {
    try {
      const res = await api.cart.removeItem(sku);
      setCart(res.data as Cart);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApplyCoupon = async (code: string) => {
    const res = await api.cart.applyCoupon(code);
    setCart(res.data as Cart);
  };

  const handleRemoveCoupon = async () => {
    const res = await api.cart.removeCoupon();
    setCart(res.data as Cart);
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-text-secondary">Loading cart...</div>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md bg-white rounded-2xl p-8 text-center shadow-sm border border-border">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={32} className="text-primary" />
          </div>
          <h1 className="text-3xl font-playfair font-bold text-text-primary mb-3">Your Cart is Empty</h1>
          <p className="text-text-secondary mb-8">
            Looks like you haven't added anything to your cart yet. Discover our premium mattresses and start shopping.
          </p>
          <Link href="/products">
            <Button size="lg" className="w-full">Shop Now</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8 md:py-12">
      <div className="container max-w-6xl">
        <div className="flex items-center gap-2 mb-6 md:mb-8 overflow-hidden">
          <Link href="/products" className="text-text-secondary hover:text-primary transition-colors shrink-0">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl md:text-3xl font-playfair font-bold text-primary truncate">Shopping Cart</h1>
          <span className="text-text-secondary font-medium bg-gray-200 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm shrink-0">
            {itemCount} Items
          </span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Cart Items List */}
          <div className="w-full lg:w-2/3 bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
            <div className="p-4 md:p-6 pb-2 border-b border-border hidden md:grid grid-cols-12 text-sm font-semibold text-text-secondary uppercase tracking-wider">
              <div className="col-span-8">Product</div>
              <div className="col-span-4 text-right">Total</div>
            </div>
            
            <div className="p-4 md:p-6 flex flex-col gap-2">
              {cart.items.map(item => (
                <CartItem 
                  key={item.sku} 
                  item={item} 
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={handleRemove}
                />
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-2xl shadow-sm border border-border p-6 sticky top-24">
              <h2 className="text-xl font-playfair font-bold mb-6">Order Summary</h2>
              
              <CouponInput 
                currentCoupon={cart.couponCode} 
                onApply={handleApplyCoupon} 
                onRemove={handleRemoveCoupon} 
              />
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center text-text-secondary">
                  <span>Subtotal</span>
                  <span className="font-medium text-text-primary">{formatPrice(cart.subtotal)}</span>
                </div>
                
                {cart.totalDiscount > 0 && (
                  <div className="flex justify-between items-center text-success">
                    <span>Discount</span>
                    <span className="font-medium">-{formatPrice(cart.totalDiscount)}</span>
                  </div>
                )}
                
                <div className="flex justify-between items-center text-text-secondary">
                  <span>Estimated Tax</span>
                  <span className="font-medium text-text-primary">{formatPrice(cart.taxAmount)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-border mb-8">
                <span className="font-bold text-lg">Total</span>
                <span className="font-bold text-2xl text-primary">{formatPrice(cart.totalAmount)}</span>
              </div>

              <Button 
                size="lg" 
                className="w-full shadow-md text-lg" 
                onClick={() => router.push('/checkout')}
              >
                Proceed to Checkout
              </Button>

              <div className="mt-6 flex flex-col gap-3">
                <div className="flex items-center gap-3 text-sm text-text-secondary bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <ShieldCheck className="text-primary shrink-0" size={20} />
                  <span>Secure encrypted checkout</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-text-secondary bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <Truck className="text-primary shrink-0" size={20} />
                  <span>Free delivery within 3-5 days</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
