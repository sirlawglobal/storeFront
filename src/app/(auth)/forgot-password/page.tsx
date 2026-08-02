'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');
    
    try {
      await api.auth.forgotPassword({ email });
      setMessage('Password reset instructions have been sent to your email.');
    } catch (err: any) {
      setError(err.message || 'Failed to process request');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 md:p-10">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-text-primary mb-2">Forgot Password</h1>
        <p className="text-sm text-text-secondary">Enter your email to receive reset instructions</p>
      </div>

      {error && <div className="bg-red-50 text-error text-sm p-3 rounded-md mb-6">{error}</div>}
      {message && <div className="bg-green-50 text-success text-sm p-3 rounded-md mb-6">{message}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Email Address</label>
          <input 
            type="email" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-base"
          />
        </div>

        <Button type="submit" className="w-full h-12 text-base mt-2" isLoading={isLoading}>
          Send Instructions
        </Button>
      </form>

      <div className="mt-8 text-center text-sm">
        <Link href="/login" className="text-primary font-medium hover:underline">
          Back to Sign In
        </Link>
      </div>
    </div>
  );
}
