'use client';
import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { api } from '@/lib/api';
import { getGuestId } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/account';
  const { login } = useAuthStore();
  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Backend returns: { sessionToken, expiresAt, user: { id, firstName, lastName, email, role, isVerified } }
      const res: any = await api.auth.login(formData);
      // Backend TransformResponseInterceptor wraps payload in { success: true, data: { sessionToken, user, ... } }
      const payload = res?.data ?? res;
      const sessionToken = payload?.sessionToken || payload?.token;
      const rawUser = payload?.user;

      if (!sessionToken || !rawUser) {
        throw new Error('Invalid response from server');
      }

      // Normalise: backend returns `id`, frontend uses `_id`
      const user = { ...rawUser, _id: rawUser.id || rawUser._id };

      // Save auth state — token is the sessionToken
      login(user, sessionToken);
      
      // Merge guest cart automatically
      const guestId = getGuestId();
      try {
        await api.cart.mergeGuestCart(guestId);
      } catch (mergeErr) {
        console.error('Failed to merge guest cart', mergeErr);
      }
      
      router.push(redirectTo);
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 md:p-10">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-text-primary mb-2">Welcome Back</h1>
        <p className="text-sm text-text-secondary">Sign in to your Vitafoam account</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-error text-error text-sm p-3 rounded-md mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Email or Phone Number</label>
          <input 
            type="text" 
            name="identifier"
            required
            value={formData.identifier}
            onChange={handleChange}
            placeholder="Enter your email or phone"
            className="input-base"
          />
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-text-primary">Password</label>
            <Link href="/forgot-password" className="text-xs text-primary font-medium hover:underline">
              Forgot Password?
            </Link>
          </div>
          <input 
            type="password" 
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className="input-base"
          />
        </div>

        <div className="flex items-center gap-2 py-2">
          <input type="checkbox" id="remember" className="rounded text-primary focus:ring-primary w-4 h-4 cursor-pointer" />
          <label htmlFor="remember" className="text-sm text-text-secondary cursor-pointer">Remember me</label>
        </div>

        <Button type="submit" className="w-full h-12 text-base" isLoading={isLoading}>
          Sign In
        </Button>
      </form>

      <div className="mt-8 text-center text-sm">
        <p className="text-text-secondary">
          Don't have an account?{' '}
          <Link href="/register" className="text-primary font-medium hover:underline">
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
