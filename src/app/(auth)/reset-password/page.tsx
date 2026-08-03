'use client';
import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Backend flow: forgot-password sends OTP to email, then reset-password uses email + otp + newPassword
  const emailParam = searchParams.get('email') || '';

  const [email, setEmail] = useState(emailParam);
  const [otp, setOtp] = useState('');
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
    if (!email) {
      setError('Email address is required');
      return;
    }
    if (otp.length !== 6) {
      setError('Please enter the 6-digit code from your email');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Backend ResetPasswordDto expects: { email, otp, newPassword }
      await api.auth.resetPassword({ email, otp, newPassword: password });
      router.push('/login?reset=success');
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 md:p-10">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-text-primary mb-2">Create New Password</h1>
        <p className="text-sm text-text-secondary">
          Enter the verification code sent to your email and choose a new password.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-error text-sm p-3 rounded-md mb-6">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {!emailParam && (
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-base"
              placeholder="Your account email"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">
            Verification Code
          </label>
          <input
            type="text"
            inputMode="numeric"
            required
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            className="input-base tracking-widest text-center text-lg font-bold"
            placeholder="000000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">
            New Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-base"
            placeholder="Min 8 chars, upper, lower, number, symbol"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">
            Confirm New Password
          </label>
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
