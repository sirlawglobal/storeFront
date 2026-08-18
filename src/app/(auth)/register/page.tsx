'use client';
import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '';
  const [formData, setFormData] = useState({ 
    firstName: '', 
    lastName: '', 
    email: '', 
    phone: '', 
    password: '' 
  });
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
      await api.auth.register(formData);
      // Pass identifier to OTP page via query param (in a real app, use better state management)
      const otpUrl = `/verify-otp?identifier=${encodeURIComponent(formData.email)}${redirectTo ? `&redirect=${encodeURIComponent(redirectTo)}` : ''}`;
      router.push(otpUrl);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 md:p-10">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-text-primary mb-2">Create an Account</h1>
        <p className="text-sm text-text-secondary">Join Vitafoam for a better sleep experience</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-error text-error text-sm p-3 rounded-md mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">First Name</label>
            <input 
              type="text" name="firstName" required
              value={formData.firstName} onChange={handleChange}
              className="input-base"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Last Name</label>
            <input 
              type="text" name="lastName" required
              value={formData.lastName} onChange={handleChange}
              className="input-base"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Email Address</label>
          <input 
            type="email" name="email" required
            value={formData.email} onChange={handleChange}
            className="input-base"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Phone Number</label>
          <input 
            type="tel" name="phone" required
            value={formData.phone} onChange={handleChange}
            placeholder="+234..."
            className="input-base"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Password</label>
          <input 
            type="password" name="password" required
            value={formData.password} onChange={handleChange}
            className="input-base"
          />
        </div>

        <Button type="submit" className="w-full h-12 text-base mt-2" isLoading={isLoading}>
          Create Account
        </Button>
      </form>

      <div className="mt-8 text-center text-sm">
        <p className="text-text-secondary">
          Already have an account?{' '}
          <Link href="/login" className="text-primary font-medium hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterForm />
    </Suspense>
  );
}
