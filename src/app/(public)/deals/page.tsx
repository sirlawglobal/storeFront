'use client';
import React from 'react';
import { Tag } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const ACTIVE_DEALS = [
  { id: '1', title: 'Grand Opening Offer', description: 'Get 15% off all orthopedic mattresses.', code: 'SLEEPWELL15', validUntil: 'Aug 31, 2026' },
  { id: '2', title: 'Free Pillow Pack', description: 'Buy any King size mattress and get 2 memory pillows free.', code: 'KINGBONUS', validUntil: 'Aug 15, 2026' },
];

export default function DealsPage() {
  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    alert('Code copied to clipboard: ' + code);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-playfair font-bold text-primary mb-4">Promotions & Deals</h1>
          <p className="text-lg text-text-secondary">Discover our latest offers and save on premium sleep products.</p>
        </div>

        <div className="grid gap-6">
          {ACTIVE_DEALS.map(deal => (
            <div key={deal.id} className="bg-white rounded-2xl shadow-sm border border-border p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center justify-between">
              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-bold mb-4">
                  <Tag size={16} /> Special Offer
                </div>
                <h2 className="text-2xl font-bold text-text-primary mb-2">{deal.title}</h2>
                <p className="text-text-secondary mb-4">{deal.description}</p>
                <p className="text-sm text-text-secondary">Valid until {deal.validUntil}</p>
              </div>
              
              <div className="w-full md:w-auto bg-gray-50 p-6 rounded-xl border border-dashed border-gray-300 text-center shrink-0 min-w-[250px]">
                <p className="text-sm text-text-secondary mb-2 uppercase tracking-wider font-semibold">Use Promo Code</p>
                <p className="text-3xl font-bold text-primary tracking-widest mb-4 font-mono">{deal.code}</p>
                <Button variant="outline" className="w-full bg-white" onClick={() => copyCode(deal.code)}>
                  Copy Code
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
