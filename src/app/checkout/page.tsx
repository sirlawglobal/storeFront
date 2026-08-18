'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ShieldCheck, MapPin, CreditCard, Lock, Plus, Tag, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { useCartStore } from '@/store/cart.store';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';
import { api } from '@/lib/api';
import { getGuestId } from '@/lib/utils';
import { Address } from '@/types';

type PaymentMethod = 'paystack' | 'flutterwave' | 'moniepoint' | 'opay';

export default function CheckoutPage() {
  const router = useRouter();
  const { isLoggedIn, _hasHydrated, user, login } = useAuthStore();
  const { cart, setCart, clearCart } = useCartStore();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('paystack');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [error, setError] = useState('');

  // Guest login form state
  const [guestForm, setGuestForm] = useState({ identifier: '', password: '' });
  const [guestLoginLoading, setGuestLoginLoading] = useState(false);
  const [guestLoginError, setGuestLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleGuestLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuestLoginLoading(true);
    setGuestLoginError('');
    try {
      const res: any = await api.auth.login(guestForm);
      const payload = res?.data ?? res;
      const sessionToken = payload?.sessionToken || payload?.token;
      const rawUser = payload?.user;
      if (!sessionToken || !rawUser) throw new Error('Invalid response from server');
      const user = { ...rawUser, _id: rawUser.id || rawUser._id };
      login(user, sessionToken);
      // Merge the guest cart items into the new session
      const guestId = getGuestId();
      try { await api.cart.mergeGuestCart(guestId); } catch { /* non-fatal */ }
      // Stay on /checkout — the isLoggedIn state change will re-render the full checkout form
    } catch (err: any) {
      setGuestLoginError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setGuestLoginLoading(false);
    }
  };

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

  const [availableProviders, setAvailableProviders] = useState<PaymentMethod[]>(['paystack']);

  // Fetch Active Gateway from Admin Settings
  useEffect(() => {
    const fetchActiveGateway = async () => {
      try {
        const res: any = await api.payments.getGateways();
        const data = res?.data ?? res;
        if (data?.defaultProvider) {
          const active = data.defaultProvider.toLowerCase() as PaymentMethod;
          setPaymentMethod(active);
          setAvailableProviders([active]);
        }
      } catch {
        // Fallback to paystack if API fails
      }
    };
    fetchActiveGateway();
  }, []);

  // NOTE: We do NOT auto-redirect guests here.
  // Instead we render a guest prompt below so they see a clear message.

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

  // Show an inline login form for guests instead of redirecting
  if (_hasHydrated && !isLoggedIn) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-border w-full max-w-md overflow-hidden">
          {/* Header */}
          <div className="bg-primary/5 border-b border-border px-8 py-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
              <Lock size={22} className="text-primary" />
            </div>
            <h1 className="text-2xl font-playfair font-bold text-primary">Sign in to Continue</h1>
            <p className="text-text-secondary text-sm mt-1">Enter your details to proceed to checkout</p>
          </div>

          {/* Form */}
          <div className="px-8 py-7">
            {guestLoginError && (
              <div className="bg-red-50 border border-error text-error text-sm p-3 rounded-lg mb-5">
                {guestLoginError}
              </div>
            )}

            <form onSubmit={handleGuestLogin} className="space-y-4">
              {/* Email / Phone */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">
                  Email or Phone Number
                </label>
                <input
                  type="text"
                  name="identifier"
                  required
                  autoFocus
                  value={guestForm.identifier}
                  onChange={(e) => setGuestForm({ ...guestForm, identifier: e.target.value })}
                  placeholder="Enter your email or phone"
                  className="input-base"
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-sm font-medium text-text-primary">Password</label>
                  <Link href="/forgot-password" className="text-xs text-primary font-medium hover:underline">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    value={guestForm.password}
                    onChange={(e) => setGuestForm({ ...guestForm, password: e.target.value })}
                    placeholder="Enter your password"
                    className="input-base pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full h-12 text-base mt-2"
                isLoading={guestLoginLoading}
              >
                Sign In & Continue to Checkout
              </Button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-text-secondary font-medium">OR</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Register */}
            <Link
              href="/register?redirect=/checkout"
              className="w-full flex items-center justify-center gap-2 border border-border text-text-primary font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors text-sm"
            >
              Create a New Account
            </Link>

            {/* Back link */}
            <div className="mt-5 text-center">
              <Link href="/cart" className="text-sm text-text-secondary hover:text-primary transition-colors">
                ← Back to Cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!_hasHydrated || !cart || cart.items.length === 0) return null;

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
      const paymentUrl = data?.paymentUrl || res?.paymentUrl || res?.data?.paymentUrl;
      clearCart();

      // If backend provides a payment URL, redirect there; otherwise go to orders
      if (paymentUrl) {
        window.location.href = paymentUrl;
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
        <div className="flex items-center justify-between mb-6 md:mb-8 gap-4">
          <div className="flex items-center gap-2">
            <Link href="/cart" className="text-text-secondary hover:text-primary transition-colors shrink-0">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-2xl md:text-3xl font-playfair font-bold text-primary">Checkout</h1>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-text-secondary text-xs md:text-sm shrink-0">
            <Lock size={14} className="text-green-600" />
            <span>Secure SSL Encrypted checkout</span>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-error text-error text-sm rounded-xl">
            {error}
          </div>
        )}

        <div className="flex flex-col-reverse lg:flex-row gap-6 md:gap-8">
          {/* Main Checkout Flow */}
          <div className="w-full lg:w-2/3 space-y-6">

            {/* Delivery Address Selection */}
            <div className="bg-white rounded-2xl shadow-sm border border-border p-6 space-y-4">
              <h2 className="text-xl font-playfair font-bold flex items-center gap-2 pb-2 border-b border-border">
                <MapPin className="text-primary" size={22} />
                Delivery Address & Verification
              </h2>

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
                <div className="space-y-3">
                  {addresses.map((addr) => (
                    <label
                      key={addr._id}
                      className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                        selectedAddressId === addr._id
                          ? 'border-primary bg-primary/5 shadow-sm'
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
                  ))}
                </div>
              )}

              <Link href="/account/addresses" className="flex items-center gap-2 text-primary text-sm font-medium hover:underline pt-2">
                <Plus size={16} /> Add new address
              </Link>
            </div>

            {/* Order Notes (Optional) */}
            <div className="bg-white rounded-2xl shadow-sm border border-border p-6 space-y-3">
              <label className="block font-medium text-base">Delivery Instructions / Order Notes (optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="input-base resize-none h-24"
                placeholder="e.g. Call before arrival or leave with security"
              />
            </div>

            {/* Security Guarantee Notice */}
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-sm text-blue-900 flex items-center gap-3">
              <ShieldCheck className="shrink-0 text-blue-600" size={24} />
              <div>
                <p className="font-semibold">Direct Encrypted Checkout</p>
                <p className="text-xs text-blue-700 mt-0.5">
                  Clicking Proceed to Payment will verify your order and redirect you directly to complete your payment securely.
                </p>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-2xl shadow-sm border border-border p-6 sticky top-24">
              <h2 className="text-xl font-playfair font-bold mb-4 border-b border-border pb-4">Order Summary</h2>

              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-1">
                {cart.items.map((item) => (
                  <div key={item.sku} className="flex gap-3">
                    <div className="w-14 h-14 bg-gray-100 rounded border border-border overflow-hidden shrink-0">
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
                className="w-full shadow-md text-lg font-bold py-3.5"
                onClick={handlePlaceOrder}
                disabled={!selectedAddressId}
                isLoading={isLoading}
              >
                Proceed to Payment
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
