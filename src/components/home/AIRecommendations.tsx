import React from 'react';
import { ProductCard } from '../product/ProductCard';
import { Product } from '@/types';

const MOCK_RECS: Partial<Product>[] = [
  { _id: '5', slug: 'vita-supreme', name: 'Vita Supreme', price: 180000, images: ['https://images.unsplash.com/photo-1631679700053-14c861c88a87?w=500&q=80'], averageRating: 4.7, reviewCount: 56, brand: 'Vitafoam' },
  { _id: '6', slug: 'cervical-pillow', name: 'Cervical Contour Pillow', price: 22000, images: ['https://images.unsplash.com/photo-1584100936595-c0654b35a146?w=500&q=80'], averageRating: 4.9, reviewCount: 210, brand: 'Vitafoam' },
  { _id: '7', slug: 'sofa-bed', name: 'Foldable Sofa Bed', price: 320000, salePrice: 295000, images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80'], averageRating: 4.6, reviewCount: 34, brand: 'Vitafoam' },
];

export const AIRecommendations = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container">
        <div className="flex justify-between items-end mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-gradient-to-r from-accent to-orange-500 text-white text-xs font-bold px-2 py-1 rounded">AI Pick</span>
            </div>
            <h2 className="text-3xl font-playfair font-bold text-primary mb-2">Picked Just For You</h2>
            <p className="text-text-secondary">Based on what customers like you are buying.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_RECS.map((product) => (
            <ProductCard key={product._id} product={product as Product} />
          ))}
        </div>
      </div>
    </section>
  );
};
