'use client';
import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (!token) {
      setError('Invalid or missing reset token');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      await api.auth.resetPassword({ token, newPassword: password });
      router.push('/login?reset=success');
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="p-8 text-center text-error">
        Invalid or missing reset token. Please request a new password reset.
      </div>
    );
  }

  return (
    <div className="p-8 md:p-10">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-text-primary mb-2">Create New Password</h1>
        <p className="text-sm text-text-secondary">Please enter your new password below</p>
      </div>

      {error && <div className="bg-red-50 text-error text-sm p-3 rounded-md mb-6">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">New Password</label>
          <input 
            type="password" 
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-base"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Confirm New Password</label>
          <input 
            type="password" 
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="input-base"
          />
        </div>

        <Button type="submit" className="w-full h-12 text-base mt-2" isLoading={isLoading}>
          Reset Password
        </Button>
      </form>
    </div>
  );
}
