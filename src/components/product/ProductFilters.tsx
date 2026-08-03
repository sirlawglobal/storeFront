'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Filter, X, ChevronDown } from 'lucide-react';
import { Button } from '../ui/Button';
import { api } from '@/lib/api';

const PRICE_RANGES = [
  { label: 'Under ₦50,000', value: '0-50000' },
  { label: '₦50,000 - ₦100,000', value: '50000-100000' },
  { label: '₦100,000 - ₦250,000', value: '100000-250000' },
  { label: 'Over ₦250,000', value: '250000-99999999' },
];

interface CategoryItem {
  _id: string;
  name: string;
  slug: string;
}

export const ProductFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [categories, setCategories] = useState<CategoryItem[]>([]);

  const currentCategory = searchParams.get('category');
  const currentPrice = searchParams.get('price');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res: any = await api.categories.list();
        const list = res?.data ?? res;
        if (Array.isArray(list) && list.length > 0) {
          setCategories(list);
        } else {
          setCategories([
            { _id: '1', name: 'Mattresses', slug: 'mattresses' },
            { _id: '2', name: 'Pillows', slug: 'pillows' },
            { _id: '3', name: 'Furniture', slug: 'furniture' },
            { _id: '4', name: 'Beddings', slug: 'beddings' },
          ]);
        }
      } catch (err) {
        console.error('Failed to load filter categories:', err);
      }
    };
    fetchCategories();
  }, []);

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push('/products');
    setIsMobileOpen(false);
  };

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-3 flex items-center justify-between">
          Categories <ChevronDown size={16} />
        </h3>
        <ul className="space-y-2">
          {categories.map((cat) => (
            <li key={cat._id}>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  checked={currentCategory === cat.slug.toLowerCase()}
                  onChange={() => updateFilter('category', cat.slug.toLowerCase())}
                  className="text-primary focus:ring-primary h-4 w-4 accent-primary"
                />
                <span className="text-sm">{cat.name}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-semibold mb-3 flex items-center justify-between">
          Price Range <ChevronDown size={16} />
        </h3>
        <ul className="space-y-2">
          {PRICE_RANGES.map((range) => (
            <li key={range.value}>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="price"
                  checked={currentPrice === range.value}
                  onChange={() => updateFilter('price', range.value)}
                  className="text-primary focus:ring-primary h-4 w-4 accent-primary"
                />
                <span className="text-sm">{range.label}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      <Button variant="outline" className="w-full" onClick={clearFilters}>
        Clear All Filters
      </Button>
    </div>
  );

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4">
        <Button
          variant="outline"
          onClick={() => setIsMobileOpen(true)}
          leftIcon={<Filter size={18} />}
          className="w-full bg-white"
        >
          Filters &amp; Sort
        </Button>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 shrink-0 pr-8">
        <div className="sticky top-24">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border">
            <Filter size={20} className="text-primary" />
            <h2 className="font-bold text-lg">Filters</h2>
          </div>
          <FilterContent />
        </div>
      </div>

      {/* Mobile Bottom Sheet Modal */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto transform transition-transform duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-xl">Filters</h2>
              <button onClick={() => setIsMobileOpen(false)} className="p-2 bg-gray-100 rounded-full">
                <X size={20} />
              </button>
            </div>
            <FilterContent />
            <div className="mt-6 pt-4 border-t border-border sticky bottom-0 bg-white pb-4">
              <Button className="w-full" onClick={() => setIsMobileOpen(false)}>
                Show Results
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
