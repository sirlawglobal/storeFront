'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ShieldCheck, MapPin, CreditCard, Lock, Plus, Tag } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { useCartStore } from '@/store/cart.store';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';
import { api } from '@/lib/api';
import { Address } from '@/types';

type PaymentMethod = 'paystack' | 'flutterwave' | 'moniepoint' | 'opay';

export default function CheckoutPage() {
  const router = useRouter();
  const { isLoggedIn, _hasHydrated, user } = useAuthStore();
  const { cart, setCart, clearCart } = useCartStore();

  const [step, setStep] = useState(1);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('paystack');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [error, setError] = useState('');

  // Coupon State
  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    setCouponError('');
    setCouponSuccess('');
    try {
      const res: any = await api.cart.applyCoupon(couponInput.trim().toUpperCase());
      const updatedCart = res?.data ?? res;
      if (updatedCart) setCart(updatedCart);
      setCouponSuccess(`Coupon '${couponInput.trim().toUpperCase()}' applied!`);
      setCouponInput('');
    } catch (err: any) {
      setCouponError(err.message || 'Invalid or expired coupon code');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = async () => {
    setCouponLoading(true);
    setCouponError('');
    setCouponSuccess('');
    try {
      const res: any = await api.cart.removeCoupon();
      const updatedCart = res?.data ?? res;
      if (updatedCart) setCart(updatedCart);
      setCouponSuccess('Coupon removed');
    } catch (err: any) {
      setCouponError(err.message || 'Failed to remove coupon');
    } finally {
      setCouponLoading(false);
    }
  };

  // Auth guard
  useEffect(() => {
    if (_hasHydrated && !isLoggedIn) {
      router.push('/login?redirect=/checkout');
    }
  }, [_hasHydrated, isLoggedIn, router]);

  // Load user's saved addresses
  useEffect(() => {
    if (!_hasHydrated || !isLoggedIn) return;
    const loadAddresses = async () => {
      setIsLoadingAddresses(true);
      try {
        const res: any = await api.users.getAddresses();
        const list: Address[] = res?.data ?? res;
        if (Array.isArray(list)) {
          setAddresses(list);
          // Auto-select default address
          const def = list.find((a) => a.isDefault);
          if (def) setSelectedAddressId(def._id);
          else if (list.length > 0) setSelectedAddressId(list[0]._id);
        }
      } catch {
        // If loading fails, user can add an address
      } finally {
        setIsLoadingAddresses(false);
      }
    };
    loadAddresses();
  }, [_hasHydrated, isLoggedIn]);

  if (!_hasHydrated || !isLoggedIn || !cart || cart.items.length === 0) return null;

  const selectedAddress = addresses.find((a) => a._id === selectedAddressId);

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      setError('Please select a delivery address');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      // POST /checkout/initiate → returns { orderId, paymentReference, paymentUrl, ... }
      const res: any = await api.checkout.initiate({
        shippingAddressId: selectedAddressId,
        paymentMethod,
        notes: notes || undefined,
      });

      const data = res?.data ?? res;
      clearCart();

      // If backend provides a payment URL, redirect there; otherwise go to orders
      if (data?.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        router.push(`/account/orders/${data?.orderId || ''}`);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to place order. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8 md:py-12">
      <div className="container max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Link href="/cart" className="text-text-secondary hover:text-primary transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-3xl font-playfair font-bold text-primary">Checkout</h1>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-text-secondary text-sm">
            <Lock size={16} className="text-green-600" />
            <span>Secure SSL Encrypted checkout</span>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-error text-error text-sm rounded-xl">
            {error}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Checkout Flow */}
          <div className="w-full lg:w-2/3 space-y-6">

            {/* Step 1: Delivery Address */}
            <div className={`bg-white rounded-2xl shadow-sm border ${step === 1 ? 'border-primary shadow-md' : 'border-border'} p-6`}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-playfair font-bold flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary text-white text-sm flex items-center justify-center">1</span>
                  Delivery Address
                </h2>
                {step > 1 && (
                  <button onClick={() => setStep(1)} className="text-primary text-sm font-medium hover:underline">Edit</button>
                )}
              </div>

              {step === 1 ? (
                <div className="space-y-4">
                  {isLoadingAddresses ? (
                    <div className="space-y-3">
                      {[1, 2].map((i) => (
                        <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />
                      ))}
                    </div>
                  ) : addresses.length === 0 ? (
                    <div className="text-center py-8 text-text-secondary">
                      <MapPin size={32} className="mx-auto text-gray-300 mb-3" />
                      <p className="mb-3">You have no saved addresses.</p>
                      <Link href="/account/addresses" className="text-primary font-medium hover:underline">
                        Add an address
                      </Link>
                    </div>
                  ) : (
                    addresses.map((addr) => (
                      <label
                        key={addr._id}
                        className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                          selectedAddressId === addr._id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="address"
                          checked={selectedAddressId === addr._id}
                          onChange={() => setSelectedAddressId(addr._id)}
                          className="mt-1 accent-primary"
                        />
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">{addr.label}</span>
                            {addr.isDefault && (
                              <span className="bg-gray-200 text-xs px-2 py-0.5 rounded font-medium">Default</span>
                            )}
                          </div>
                          <p className="text-sm text-text-secondary">{addr.street}</p>
                          <p className="text-sm text-text-secondary">{addr.city}, {addr.state}</p>
                        </div>
                      </label>
                    ))
                  )}

                  <Link href="/account/addresses" className="flex items-center gap-2 text-primary text-sm font-medium hover:underline pt-2">
                    <Plus size={16} /> Add new address
                  </Link>

                  <div className="pt-4 flex justify-end">
                    <Button
                      onClick={() => setStep(2)}
                      disabled={!selectedAddressId}
                    >
                      Continue to Payment
                    </Button>
                  </div>
                </div>
              ) : selectedAddress ? (
                <div className="text-text-secondary text-sm flex items-start gap-3">
                  <MapPin size={18} className="text-primary shrink-0" />
                  <div>
                    <p className="font-medium text-text-primary">{selectedAddress.label}</p>
                    <p>{selectedAddress.street}</p>
                    <p>{selectedAddress.city}, {selectedAddress.state}</p>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Step 2: Payment Method */}
            <div className={`bg-white rounded-2xl shadow-sm border ${step === 2 ? 'border-primary shadow-md' : 'border-border opacity-60'} p-6`}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-playfair font-bold flex items-center gap-2">
                  <span className={`w-6 h-6 rounded-full text-sm flex items-center justify-center ${step === 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>2</span>
                  Payment Method
                </h2>
              </div>

              {step === 2 && (
                <div className="space-y-4">
                  {(['paystack', 'flutterwave', 'moniepoint', 'opay'] as PaymentMethod[]).map((method) => (
                    <label
                      key={method}
                      className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-colors ${
                        paymentMethod === method ? 'border-primary bg-primary/5' : 'border-border hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === method}
                          onChange={() => setPaymentMethod(method)}
                          className="accent-primary"
                        />
                        <span className="font-medium capitalize">{method}</span>
                      </div>
                      <CreditCard size={20} className="text-text-secondary" />
                    </label>
                  ))}

                  <div>
                    <label className="block text-sm font-medium mb-1">Order Notes (optional)</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="input-base resize-none h-20"
                      placeholder="e.g. Please call before delivery"
                    />
                  </div>

                  <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg mt-4 text-sm text-blue-800 flex gap-2">
                    <ShieldCheck className="shrink-0 text-blue-600" size={20} />
                    You will be redirected to the secure payment gateway to complete your purchase.
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-2xl shadow-sm border border-border p-6 sticky top-24">
              <h2 className="text-xl font-playfair font-bold mb-4 border-b border-border pb-4">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {cart.items.map((item) => (
                  <div key={item.sku} className="flex gap-3">
                    <div className="w-16 h-16 bg-gray-100 rounded border border-border overflow-hidden shrink-0">
                      {item.image && (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-text-primary truncate">{item.name}</p>
                      <p className="text-xs text-text-secondary">Qty: {item.quantity}</p>
                      <p className="font-semibold text-sm">{formatPrice(item.price)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo Coupon Form */}
              <div className="mb-6 pt-4 border-t border-border">
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
                  Promo / Coupon Code
                </label>
                {cart.couponCode ? (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 p-2.5 rounded-xl">
                    <div className="flex items-center gap-2">
                      <Tag size={16} className="text-success" />
                      <span className="font-bold text-sm text-green-800 uppercase">{cart.couponCode}</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      disabled={couponLoading}
                      className="text-xs text-error font-medium hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. WELCOME10"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="input-base text-sm uppercase py-2 flex-1"
                    />
                    <Button type="submit" size="sm" isLoading={couponLoading}>
                      Apply
                    </Button>
                  </form>
                )}
                {couponError && <p className="text-xs text-error mt-1.5">{couponError}</p>}
                {couponSuccess && <p className="text-xs text-success mt-1.5">{couponSuccess}</p>}
              </div>

              <div className="space-y-3 mb-6 pt-4 border-t border-border text-sm">
                <div className="flex justify-between text-text-secondary">
                  <span>Subtotal</span>
                  <span className="font-medium text-text-primary">{formatPrice(cart.subtotal)}</span>
                </div>
                {cart.totalDiscount > 0 && (
                  <div className="flex justify-between text-success">
                    <span>Discount</span>
                    <span className="font-medium">-{formatPrice(cart.totalDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-text-secondary">
                  <span>Delivery</span>
                  <span className="font-medium text-text-primary">Free</span>
                </div>
                <div className="flex justify-between text-text-secondary">
                  <span>Estimated Tax</span>
                  <span className="font-medium text-text-primary">{formatPrice(cart.taxAmount)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-border mb-6">
                <span className="font-bold text-lg">Total</span>
                <span className="font-bold text-2xl text-primary">{formatPrice(cart.totalAmount)}</span>
              </div>

              <Button
                size="lg"
                className="w-full shadow-md text-lg"
                onClick={handlePlaceOrder}
                disabled={step !== 2 || !selectedAddressId}
                isLoading={isLoading}
              >
                Pay Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
