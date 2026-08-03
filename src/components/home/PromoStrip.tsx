'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';

export const PromoStrip = () => {
  const [promoText, setPromoText] = useState('🎉 Free Nationwide Delivery on Orders Over ₦200,000!');
  const [couponCode, setCouponCode] = useState('');

  useEffect(() => {
    const fetchPromo = async () => {
      try {
        const res: any = await api.promotions.getActive();
        const list = res?.data ?? res;
        if (Array.isArray(list) && list.length > 0) {
          const topPromo = list[0];
          setPromoText(topPromo.title || topPromo.description || `Special Promotion: ${topPromo.code}`);
          if (topPromo.code) setCouponCode(topPromo.code);
        }
      } catch (err) {
        console.error('Failed to load promo strip data', err);
      }
    };
    fetchPromo();
  }, []);

  return (
    <div className="bg-accent text-white py-2.5 px-4 text-center">
      <p className="text-sm font-medium flex items-center justify-center gap-2 flex-wrap">
        <span>{promoText}</span>
        {couponCode && (
          <span>
            Use code: <span className="font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded">{couponCode}</span>
          </span>
        )}
        <Link href="/products" className="underline font-semibold hover:text-primary transition-colors ml-1">
          Shop Now →
        </Link>
      </p>
    </div>
  );
};
