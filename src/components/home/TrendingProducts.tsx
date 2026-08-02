import React from 'react';
import { ProductCard } from '../product/ProductCard'; // Will create soon
import { Product } from '@/types';

// Placeholder products
const MOCK_PRODUCTS: Partial<Product>[] = [
  { _id: '1', slug: 'vita-ortho', name: 'Vita Ortho Mattress', price: 125000, salePrice: 110000, images: ['https://images.unsplash.com/photo-1505693314120-0d443867891c?w=500&q=80'], averageRating: 4.8, reviewCount: 120, brand: 'Vitafoam' },
  { _id: '2', slug: 'vita-spring', name: 'Vita Spring Firm', price: 250000, images: ['https://images.unsplash.com/photo-1540518614846-7eded433c457?w=500&q=80'], averageRating: 4.5, reviewCount: 85, brand: 'Vitafoam' },
  { _id: '3', slug: 'memory-pillow', name: 'Memory Foam Pillow', price: 15000, images: ['https://images.unsplash.com/photo-1584100936595-c0654b35a146?w=500&q=80'], averageRating: 4.9, reviewCount: 340, brand: 'Vitafoam' },
  { _id: '4', slug: 'leisure-mat', name: 'Leisure Mat', price: 12000, images: ['https://images.unsplash.com/photo-1629949009765-4fa81ba316ae?w=500&q=80'], averageRating: 4.2, reviewCount: 45, brand: 'Vitafoam' },
];

export const TrendingProducts = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-playfair font-bold text-primary mb-2">Trending Now</h2>
            <p className="text-text-secondary">Our most popular products this week.</p>
          </div>
          <a href="/products" className="hidden sm:inline-block text-primary font-medium hover:underline">
            View All
          </a>
        </div>
        
        <div className="flex overflow-x-auto md:grid md:grid-cols-4 gap-6 pb-4 snap-x snap-mandatory hide-scrollbar">
          {MOCK_PRODUCTS.map((product) => (
            <div key={product._id} className="flex-shrink-0 w-[280px] md:w-auto snap-center">
              <ProductCard product={product as Product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
