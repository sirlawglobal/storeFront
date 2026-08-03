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

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-64 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-8 text-text-secondary">
            <p>No products featured yet. Check back soon!</p>
          </div>
        ) : (
          <div className="flex overflow-x-auto md:grid md:grid-cols-4 gap-6 pb-4 snap-x snap-mandatory hide-scrollbar">
            {products.map((product) => (
              <div key={product._id} className="flex-shrink-0 w-[280px] md:w-auto snap-center">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
