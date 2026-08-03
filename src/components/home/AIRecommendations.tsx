'use client';
import React, { useEffect, useState } from 'react';
import { ProductCard } from '../product/ProductCard';
import { Product } from '@/types';
import { api } from '@/lib/api';

export const AIRecommendations = () => {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecs = async () => {
      setIsLoading(true);
      try {
        const res: any = await api.recommendations.getPopular(3);
        const list = res?.data?.items ?? res?.items ?? res?.data ?? res;
        if (Array.isArray(list)) {
          setRecommendations(list);
        }
      } catch (err) {
        console.error('Failed to load recommendations:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecs();
  }, []);

  if (!isLoading && recommendations.length === 0) {
    return null; // Don't render section if no recommendations available
  }

  return (
    <section className="py-16 bg-white">
      <div className="container">
        <div className="flex justify-between items-end mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-gradient-to-r from-accent to-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
                AI Pick
              </span>
            </div>
            <h2 className="text-3xl font-playfair font-bold text-primary mb-2">Picked Just For You</h2>
            <p className="text-text-secondary">Based on popular customer favorites.</p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
