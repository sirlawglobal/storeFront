'use client';
import React from 'react';
import { ProductCard } from '@/components/product/ProductCard';
import { Product } from '@/types';

const MOCK_WISHLIST: Partial<Product>[] = [
  { _id: '1', slug: 'vita-ortho', name: 'Vita Ortho Mattress', price: 125000, images: ['https://images.unsplash.com/photo-1505693314120-0d443867891c?w=500&q=80'], averageRating: 4.8, reviewCount: 120, brand: 'Vitafoam' },
];

export default function WishlistPage() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-border p-6 md:p-8 min-h-[60vh]">
      <h1 className="text-2xl font-playfair font-bold text-primary mb-8">My Wishlist</h1>

      {MOCK_WISHLIST.length === 0 ? (
        <div className="text-center py-12 text-text-secondary">
          <p className="text-lg">Your wishlist is empty.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {MOCK_WISHLIST.map(prod => (
            <ProductCard key={prod._id} product={prod as Product} />
          ))}
        </div>
      )}
    </div>
  );
}
