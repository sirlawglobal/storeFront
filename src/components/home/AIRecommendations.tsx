'use client';
import React, { useEffect, useState } from 'react';
import { ProductCard } from '../product/ProductCard';
import { Product } from '@/types';
import { api } from '@/lib/api';

export const AIRecommendations = () => {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [subtitle, setSubtitle] = useState('Based on popular customer favorites.');

  useEffect(() => {
    const fetchRecs = async () => {
      setIsLoading(true);
      try {
        let personalizedProducts: Product[] = [];

        // 1. First check if localStorage has saved recommended product IDs (Works for Guests & Logged-in Users on this browser)
        if (typeof window !== 'undefined') {
          const cachedIdsStr = localStorage.getItem('vita_recommended_product_ids');
          if (cachedIdsStr) {
            try {
              const cachedIds: string[] = JSON.parse(cachedIdsStr);
              if (Array.isArray(cachedIds) && cachedIds.length > 0) {
                const prodRes: any = await api.products.list({ limit: 20 });
                const prodData = prodRes?.data ?? prodRes;
                const productsList: Product[] = Array.isArray(prodData?.items)
                  ? prodData.items
                  : Array.isArray(prodData)
                  ? prodData
                  : [];

                const cachedSet = new Set(cachedIds);
                personalizedProducts = productsList.filter((p) => cachedSet.has(p._id));
              }
            } catch (e) {
              console.warn('Failed parsing cached recommended product IDs:', e);
            }
          }
        }

        // 2. If no local storage cache, try fetching user's latest sleep quiz result from backend (For Logged-in users on new devices)
        if (personalizedProducts.length === 0) {
          try {
            const quizRes: any = await api.sleepQuiz.getMyLatest();
            const quizData = quizRes?.data ?? quizRes;
            if (quizData && quizData.status === 'completed') {
              const targetSkus = new Set<string>();
              if (quizData.bestMattressSku) targetSkus.add(quizData.bestMattressSku);
              if (Array.isArray(quizData.alternativeSkus)) {
                quizData.alternativeSkus.forEach((s: string) => targetSkus.add(s));
              }
              if (Array.isArray(quizData.pillowSkus)) {
                quizData.pillowSkus.forEach((s: string) => targetSkus.add(s));
              }

              if (targetSkus.size > 0) {
                const prodRes: any = await api.products.list({ limit: 20 });
                const prodData = prodRes?.data ?? prodRes;
                const productsList: Product[] = Array.isArray(prodData?.items)
                  ? prodData.items
                  : Array.isArray(prodData)
                  ? prodData
                  : [];

                personalizedProducts = productsList.filter(
                  (p) => targetSkus.has(p._id) || p.variants?.some((v) => targetSkus.has(v.sku))
                );
              }
            }
          } catch (e) {
            // User not logged in or has no quiz history yet
          }
        }

        // 3. If personalized products found, display them!
        if (personalizedProducts.length > 0) {
          setRecommendations(personalizedProducts.slice(0, 3));
          setSubtitle('Tailored specifically to your sleep assessment profile.');
        } else {
          // 4. Fallback to popular recommendations
          const res: any = await api.recommendations.getPopular(3);
          const list = res?.data?.items ?? res?.items ?? res?.data ?? res;
          if (Array.isArray(list)) {
            setRecommendations(list);
          }
          setSubtitle('Based on popular customer favorites.');
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
            <p className="text-text-secondary">{subtitle}</p>
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
