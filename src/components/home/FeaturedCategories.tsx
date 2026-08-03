'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';

const DEFAULT_CATEGORY_IMAGES: Record<string, string> = {
  mattresses: 'https://images.unsplash.com/photo-1631679700053-14c861c88a87?w=800&q=80',
  pillows: 'https://images.unsplash.com/photo-1584100936595-c0654b35a146?w=800&q=80',
  furniture: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
  beddings: 'https://images.unsplash.com/photo-1629949009765-4fa81ba316ae?w=800&q=80',
};

interface CategoryItem {
  _id: string;
  name: string;
  slug: string;
  imageUrl?: string;
  image?: string;
}

export const FeaturedCategories = () => {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const res: any = await api.categories.list();
        const list = res?.data?.items ?? res?.data ?? res;
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
        console.error('Failed to load categories:', err);
        setCategories([
          { _id: '1', name: 'Mattresses', slug: 'mattresses' },
          { _id: '2', name: 'Pillows', slug: 'pillows' },
          { _id: '3', name: 'Furniture', slug: 'furniture' },
          { _id: '4', name: 'Beddings', slug: 'beddings' },
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <section className="py-10 md:py-16 bg-white">
      <div className="container px-4 md:px-6">
        <h2 className="text-2xl md:text-3xl font-playfair font-bold text-center mb-6 md:mb-10 text-primary">
          Shop by Category
        </h2>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-44 md:h-80 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            {categories.slice(0, 8).map((cat) => {
              const bgImg =
                cat.imageUrl ||
                cat.image ||
                DEFAULT_CATEGORY_IMAGES[cat.slug.toLowerCase()] ||
                'https://images.unsplash.com/photo-1631679700053-14c861c88a87?w=800&q=80';

              return (
                <Link
                  href={`/products?category=${cat.slug}`}
                  key={cat._id}
                  className="group relative h-44 md:h-80 rounded-xl overflow-hidden block"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${bgImg})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-3 md:bottom-6 left-3 md:left-6 right-3 md:right-6">
                    <h3 className="text-white text-base md:text-xl font-bold font-playfair mb-0.5 md:mb-1">{cat.name}</h3>
                    <span className="text-white/80 text-xs md:text-sm font-medium group-hover:text-accent transition-colors flex items-center gap-1">
                      Explore <span className="transform transition-transform group-hover:translate-x-1">→</span>
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
