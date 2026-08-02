'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ProductFilters } from '@/components/product/ProductFilters';
import { ProductGrid } from '@/components/product/ProductGrid';
import { api } from '@/lib/api';
import { Product } from '@/types';

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Capitalize slug for display
  const title = slug.charAt(0).toUpperCase() + slug.slice(1);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await api.products.list({ category: slug, limit: 20 });
        setProducts(response.data as Product[]);
      } catch (error) {
        console.error('Failed to fetch category products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [slug]);

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container">
        
        <div className="mb-8 bg-primary p-8 rounded-2xl text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative z-10">
            <h1 className="text-3xl md:text-5xl font-playfair font-bold mb-2">
              {title}
            </h1>
            <p className="text-white/80 max-w-2xl mx-auto">
              Shop our premium collection of {title.toLowerCase()}.
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-start">
          <ProductFilters />
          <div className="flex-1 w-full">
            <ProductGrid products={products} isLoading={isLoading} />
          </div>
        </div>

      </div>
    </div>
  );
}
