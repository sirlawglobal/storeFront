import React from 'react';
import { ProductCard } from './ProductCard';
import { Product } from '@/types';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse flex flex-col gap-2">
            <div className="bg-gray-200 aspect-square rounded-xl w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mt-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            <div className="h-5 bg-gray-200 rounded w-1/4 mt-auto"></div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-12 flex flex-col items-center justify-center text-center bg-gray-50 rounded-xl border border-border">
        <p className="text-lg text-text-secondary mb-2">No products found.</p>
        <p className="text-sm text-text-secondary">Try adjusting your filters or search term.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};
