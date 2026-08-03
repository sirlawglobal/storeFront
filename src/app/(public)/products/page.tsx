'use client';
import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductFilters } from '@/components/product/ProductFilters';
import { ProductGrid } from '@/components/product/ProductGrid';
import { api } from '@/lib/api';
import { Product } from '@/types';

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const category = searchParams.get('category');
        const price = searchParams.get('price');
        
        // Build query params
        const params: any = { limit: 20 };
        if (category) params.category = category;
        if (price) {
          const [min, max] = price.split('-');
          params.minPrice = min;
          params.maxPrice = max;
        }

        const response: any = await api.products.list(params);
        const list = response?.data?.items ?? response?.items ?? response?.data ?? response;
        setProducts(Array.isArray(list) ? list : []);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container">
        
        {/* Page Header */}
        <div className="mb-6 md:mb-8 bg-white p-5 md:p-8 rounded-2xl border border-border text-center">
          <h1 className="text-2xl md:text-4xl font-playfair font-bold text-primary mb-2">
            All Products
          </h1>
          <p className="text-sm text-text-secondary max-w-2xl mx-auto">
            Explore our complete range of premium mattresses, pillows, and sleep accessories designed for your ultimate comfort.
          </p>
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

export default function ProductsPage() {
  return (
    <Suspense fallback={null}>
      <ProductsPageContent />
    </Suspense>
  );
}
