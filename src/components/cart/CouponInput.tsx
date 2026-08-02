import React, { useState } from 'react';
import { Button } from '../ui/Button';

interface CouponInputProps {
  currentCoupon?: string;
  onApply: (code: string) => Promise<void>;
  onRemove: () => Promise<void>;
}

export const CouponInput: React.FC<CouponInputProps> = ({ currentCoupon, onApply, onRemove }) => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    
    setIsLoading(true);
    setError('');
    try {
      await onApply(code.trim());
      setCode('');
    } catch (err: any) {
      setError(err.message || 'Invalid coupon code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async () => {
    setIsLoading(true);
    try {
      await onRemove();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (currentCoupon) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-md p-3 flex justify-between items-center mb-4">
        <div>
          <p className="text-sm font-semibold text-green-800">Coupon Applied!</p>
          <p className="text-xs text-green-700 font-medium bg-green-200/50 px-2 py-0.5 rounded inline-block mt-1">
            {currentCoupon}
          </p>
        </div>
        <button 
          onClick={handleRemove} 
          disabled={isLoading}
          className="text-xs text-error hover:underline font-medium disabled:opacity-50"
        >
          Remove
        </button>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <form onSubmit={handleApply} className="flex gap-2">
        <input 
          type="text" 
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Promo code"
          className="flex-1 border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary"
        />
        <Button 
          type="submit" 
          disabled={!code.trim() || isLoading} 
          isLoading={isLoading}
          className="shrink-0"
        >
          Apply
        </Button>
      </form>
      {error && <p className="text-error text-xs mt-1">{error}</p>}
    </div>
  );
};
