'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search as SearchIcon, Loader2 } from 'lucide-react';
import { ProductGrid } from '@/components/product/ProductGrid';
import { api } from '@/lib/api';
import { Product } from '@/types';
import { Button } from '@/components/ui/Button';

// Simple debounce helper
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const debouncedQuery = useDebounce(query, 500);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    // Update URL when debounced query changes
    if (debouncedQuery !== (searchParams.get('q') || '')) {
      const params = new URLSearchParams(searchParams.toString());
      if (debouncedQuery) {
        params.set('q', debouncedQuery);
      } else {
        params.delete('q');
      }
      router.replace(`?${params.toString()}`);
    }

    // Fetch products
    const fetchResults = async () => {
      if (!debouncedQuery.trim()) {
        setProducts([]);
        setHasSearched(false);
        return;
      }

      setIsLoading(true);
      setHasSearched(true);
      try {
        const response = await api.products.list({ search: debouncedQuery, limit: 20 });
        setProducts(response.data as Product[]);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery, searchParams, router]);

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container max-w-5xl">
        
        {/* Search Input Area */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-playfair font-bold text-primary mb-6">
            Search Products
          </h1>
          <div className="relative max-w-2xl mx-auto">
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for mattresses, pillows, etc..."
              className="w-full pl-12 pr-4 py-4 rounded-full border border-border shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-lg"
              autoFocus
            />
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
            {isLoading && (
              <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 text-primary animate-spin" size={20} />
            )}
          </div>
        </div>

        {/* Results Area */}
        {hasSearched && (
          <div>
            <h2 className="text-xl font-medium mb-6">
              {isLoading ? 'Searching...' : `Found ${products.length} result${products.length !== 1 ? 's' : ''} for "${debouncedQuery}"`}
            </h2>
            
            <ProductGrid products={products} isLoading={isLoading} />
          </div>
        )}

        {!hasSearched && (
          <div className="py-20 text-center text-text-secondary">
            <SearchIcon size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-lg">Enter a search term to find products.</p>
          </div>
        )}

      </div>
    </div>
  );
}
