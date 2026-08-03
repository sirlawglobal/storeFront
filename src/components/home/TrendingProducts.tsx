'use client';
import React, { useEffect, useState } from 'react';
import { ProductCard } from '../product/ProductCard';
import { Product } from '@/types';
import { api } from '@/lib/api';

export const TrendingProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response: any = await api.products.list({ limit: 8 });
        const list = response?.data?.items ?? response?.items ?? response?.data ?? response;
        if (Array.isArray(list) && list.length > 0) {
          setProducts(list);
        }
      } catch (err) {
        console.error('Failed to load trending products:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="py-10 md:py-16 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex justify-between items-end mb-6 md:mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-playfair font-bold text-primary mb-1 md:mb-2">Trending Now</h2>
            <p className="text-sm md:text-base text-text-secondary">Our most popular products this week.</p>
          </div>
          <a href="/products" className="text-sm text-primary font-medium hover:underline shrink-0 ml-4">
            View All
          </a>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-56 md:h-64 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-8 text-text-secondary">
            <p>No products featured yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
