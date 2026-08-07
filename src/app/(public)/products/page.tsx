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
  const [page, setPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const limit = 20;

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const category = searchParams.get('category');
        const price = searchParams.get('price');
        const urlPage = searchParams.get('page');
        const currentPage = urlPage ? parseInt(urlPage, 10) : page;
        
        // Build query params
        const params: any = { limit, page: currentPage };
        if (category) {
          params.category = category;
          params.categorySlug = category;
        }
        if (price) {
          const [min, max] = price.split('-');
          params.minPrice = min;
          params.maxPrice = max;
        }

        const response: any = await api.products.list(params);
        const list = response?.data?.items ?? response?.items ?? response?.data ?? response;
        const total = response?.data?.total ?? response?.total ?? (Array.isArray(list) ? list.length : 0);
        
        setProducts(Array.isArray(list) ? list : []);
        setTotalProducts(total);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams, page]);

  const totalPages = Math.ceil(totalProducts / limit);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

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

            {/* Pagination Controls */}
            {!isLoading && totalPages > 1 && (
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-border">
                <p className="text-xs text-text-secondary">
                  Showing <span className="font-semibold text-primary">{(page - 1) * limit + 1}</span> to{' '}
                  <span className="font-semibold text-primary">{Math.min(page * limit, totalProducts)}</span> of{' '}
                  <span className="font-semibold text-primary">{totalProducts.toLocaleString()}</span> products
                </p>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-text-secondary hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>

                  {/* Page buttons */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum = page;
                    if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }
                    if (pageNum < 1 || pageNum > totalPages) return null;

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${
                          page === pageNum
                            ? 'bg-primary text-white'
                            : 'border border-border text-text-secondary hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    className="px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-text-secondary hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
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
