'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ShieldCheck, MapPin, CreditCard, Lock } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { useCartStore } from '@/store/cart.store';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';
import { api } from '@/lib/api';

export default function CheckoutPage() {
  const router = useRouter();
  const { isLoggedIn, user } = useAuthStore();
  const { cart } = useCartStore();
  
  const [step, setStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState('1');
  const [paymentMethod, setPaymentMethod] = useState('paystack');
  const [isLoading, setIsLoading] = useState(false);

  // Simple auth check
  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login?redirect=/checkout');
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn || !cart || cart.items.length === 0) return null;

  const handlePlaceOrder = async () => {
    setIsLoading(true);
    try {
      // Mock API call to initiate checkout
      // const res = await api.orders.checkout({ addressId: selectedAddress, paymentMethod });
      
      // Simulate redirect to payment gateway
      setTimeout(() => {
        setIsLoading(false);
        alert('Redirecting to ' + paymentMethod + ' gateway...');
        router.push('/account/orders'); // mock redirect
      }, 1500);
    } catch (err) {
      console.error(err);
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
                  {[1, 2].map(id => (
                    <label key={id} className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                      selectedAddress === id.toString() ? 'border-primary bg-primary/5' : 'border-border hover:bg-gray-50'
                    }`}>
                      <input 
                        type="radio" 
                        name="address" 
                        checked={selectedAddress === id.toString()} 
                        onChange={() => setSelectedAddress(id.toString())}
                        className="mt-1 accent-primary" 
                      />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">{user?.firstName} {user?.lastName}</span>
                          {id === 1 && <span className="bg-gray-200 text-xs px-2 py-0.5 rounded font-medium">Default</span>}
                        </div>
                        <p className="text-sm text-text-secondary">123 Sleepy Hollow Road, Ikeja, Lagos</p>
                        <p className="text-sm text-text-secondary">+2348012345678</p>
                      </div>
                    </label>
                  ))}
                  <Button variant="outline" className="w-full">Add New Address</Button>
                  <div className="pt-4 flex justify-end">
                    <Button onClick={() => setStep(2)}>Continue to Payment</Button>
                  </div>
                </div>
              ) : (
                <div className="text-text-secondary text-sm flex items-start gap-3">
                  <MapPin size={18} className="text-primary shrink-0" />
                  <div>
                    <p className="font-medium text-text-primary">{user?.firstName} {user?.lastName}</p>
                    <p>123 Sleepy Hollow Road, Ikeja, Lagos</p>
                  </div>
                </div>
              )}
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
                  <label className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-colors ${
                    paymentMethod === 'paystack' ? 'border-primary bg-primary/5' : 'border-border hover:bg-gray-50'
                  }`}>
                    <div className="flex items-center gap-3">
                      <input 
                        type="radio" 
                        name="payment" 
                        checked={paymentMethod === 'paystack'} 
                        onChange={() => setPaymentMethod('paystack')}
                        className="accent-primary" 
                      />
                      <span className="font-medium">Paystack</span>
                    </div>
                    <CreditCard size={20} className="text-text-secondary" />
                  </label>

                  <label className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-colors ${
                    paymentMethod === 'flutterwave' ? 'border-primary bg-primary/5' : 'border-border hover:bg-gray-50'
                  }`}>
                    <div className="flex items-center gap-3">
                      <input 
                        type="radio" 
                        name="payment" 
                        checked={paymentMethod === 'flutterwave'} 
                        onChange={() => setPaymentMethod('flutterwave')}
                        className="accent-primary" 
                      />
                      <span className="font-medium">Flutterwave</span>
                    </div>
                    <CreditCard size={20} className="text-text-secondary" />
                  </label>
                  
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
                {cart.items.map(item => (
                  <div key={item.sku} className="flex gap-3">
                    <div className="w-16 h-16 bg-gray-100 rounded border border-border overflow-hidden shrink-0">
                      {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-text-primary truncate">{item.name}</p>
                      <p className="text-xs text-text-secondary">Qty: {item.quantity}</p>
                      <p className="font-semibold text-sm">{formatPrice(item.price)}</p>
                    </div>
                  </div>
                ))}
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
                disabled={step !== 2}
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
