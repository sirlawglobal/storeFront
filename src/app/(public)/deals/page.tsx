'use client';
import React, { useEffect, useState } from 'react';
import { Tag, Copy, Check, Percent } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';

interface DealItem {
  _id: string;
  code: string;
  title?: string;
  description?: string;
  discountType?: 'percentage' | 'fixed';
  discountValue?: number;
  minOrderAmount?: number;
  expiresAt?: string;
}

export default function DealsPage() {
  const [deals, setDeals] = useState<DealItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeals = async () => {
      setIsLoading(true);
      try {
        const res: any = await api.promotions.getActive();
        const list = res?.data ?? res;
        if (Array.isArray(list)) {
          setDeals(list);
        }
      } catch (err) {
        console.error('Failed to load active deals:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDeals();
  }, []);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-playfair font-bold text-primary mb-4">Promotions &amp; Deals</h1>
          <p className="text-lg text-text-secondary">Discover our latest promotional offers and discount codes.</p>
        </div>

        {isLoading ? (
          <div className="grid gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="h-44 bg-gray-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : deals.length === 0 ? (
          <div className="bg-white rounded-2xl border border-border p-12 text-center text-text-secondary">
            <Percent size={48} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-bold text-text-primary mb-2">No Active Deals Right Now</h2>
            <p>Check back soon for upcoming holiday sales and promotional discounts!</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {deals.map((deal) => {
              const formattedExpiry = deal.expiresAt
                ? new Date(deal.expiresAt).toLocaleDateString('en-NG', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })
                : 'Limited Time';

              return (
                <div
                  key={deal._id}
                  className="bg-white rounded-2xl shadow-sm border border-border p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center justify-between"
                >
                  <div className="flex-1 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-bold mb-4">
                      <Tag size={16} /> Special Offer
                    </div>
                    <h2 className="text-2xl font-bold text-text-primary mb-2">
                      {deal.title || `Coupon Code: ${deal.code}`}
                    </h2>
                    <p className="text-text-secondary mb-4">
                      {deal.description ||
                        `Apply code ${deal.code} at checkout to receive instant savings.`}
                    </p>
                    {deal.minOrderAmount && deal.minOrderAmount > 0 ? (
                      <p className="text-xs text-text-secondary">
                        Min. Order: ₦{deal.minOrderAmount.toLocaleString()} • Valid until {formattedExpiry}
                      </p>
                    ) : (
                      <p className="text-xs text-text-secondary">Valid until {formattedExpiry}</p>
                    )}
                  </div>

                  <div className="w-full md:w-auto bg-gray-50 p-6 rounded-xl border border-dashed border-gray-300 text-center shrink-0 min-w-[250px]">
                    <p className="text-sm text-text-secondary mb-2 uppercase tracking-wider font-semibold">
                      Use Promo Code
                    </p>
                    <p className="text-3xl font-bold text-primary tracking-widest mb-4 font-mono">
                      {deal.code}
                    </p>
                    <Button
                      variant="outline"
                      className="w-full bg-white"
                      leftIcon={copiedCode === deal.code ? <Check size={16} className="text-success" /> : <Copy size={16} />}
                      onClick={() => copyCode(deal.code)}
                    >
                      {copiedCode === deal.code ? 'Copied!' : 'Copy Code'}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
