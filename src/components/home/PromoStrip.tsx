import React from 'react';
import Link from 'next/link';

// Placeholder for now
export const PromoStrip = () => {
  return (
    <div className="bg-accent text-white py-3 px-4 text-center">
      <p className="text-sm font-medium">
        🎉 Grand Opening Sale! Get 15% off all orthopedic mattresses. Use code: <span className="font-bold">SLEEPWELL15</span>
        <Link href="/deals" className="ml-2 underline font-semibold hover:text-primary transition-colors">Shop Deals</Link>
      </p>
    </div>
  );
};
