'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, ShoppingCart, User, Menu, Heart, ChevronDown } from 'lucide-react';
import { useCartStore } from '@/store/cart.store';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '../ui/Button';
import { api } from '@/lib/api';

interface HeaderProps {
  onOpenMobileMenu: () => void;
}

interface CategoryItem {
  _id: string;
  name: string;
  slug: string;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu }) => {
  const { itemCount, openCart } = useCartStore();
  const { isLoggedIn, user } = useAuthStore();
  const [categories, setCategories] = useState<CategoryItem[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res: any = await api.categories.list();
        const list = res?.data?.items ?? res?.data ?? res;
        if (Array.isArray(list) && list.length > 0) {
          setCategories(list);
        }
      } catch (err) {
        console.error('Failed to load nav categories', err);
      }
    };
    fetchCategories();
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto h-16 flex items-center justify-between">
        {/* Mobile Menu Button */}
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 text-text-primary hover:bg-gray-100 rounded-md"
        >
          <Menu size={24} />
        </button>

        {/* Logo */}
        <Link href="/" className="flex items-center">
          <span className="font-playfair text-2xl font-bold text-primary tracking-tight">
            Vitafoam
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/products" className="text-sm font-medium hover:text-primary transition-colors">
            All Products
          </Link>

          {/* Dynamic Categories Dropdown or Items */}
          {categories.length > 0 ? (
            <>
              {categories.slice(0, 4).map((cat) => (
                <Link
                  key={cat._id}
                  href={`/products?category=${cat.slug}`}
                  className="text-sm font-medium hover:text-primary transition-colors capitalize"
                >
                  {cat.name}
                </Link>
              ))}

              {categories.length > 4 && (
                <div className="relative group">
                  <button className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1 py-2">
                    More Categories <ChevronDown size={14} />
                  </button>
                  <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-border rounded-xl shadow-lg p-2 hidden group-hover:block max-h-80 overflow-y-auto custom-scrollbar z-50">
                    {categories.slice(4).map((cat) => (
                      <Link
                        key={cat._id}
                        href={`/products?category=${cat.slug}`}
                        className="block px-3 py-2 text-sm text-text-primary hover:bg-gray-50 rounded-lg transition-colors capitalize"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <Link
              href="/products?category=mattresses"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Mattresses
            </Link>
          )}

          <Link href="/deals" className="text-sm font-medium text-accent hover:opacity-80 transition-opacity">
            Deals
          </Link>
          <Link href="/sleep-quiz" className="text-sm font-medium hover:text-primary transition-colors">
            Sleep Quiz
          </Link>
        </nav>

        {/* Action Icons */}
        <div className="flex items-center gap-2 md:gap-4">
          <Link href="/search" className="p-2 text-text-primary hover:text-primary transition-colors hidden sm:block">
            <Search size={20} />
          </Link>

          <Link href="/account/wishlist" className="p-2 text-text-primary hover:text-primary transition-colors hidden md:block">
            <Heart size={20} />
          </Link>

          {isLoggedIn ? (
            <Link
              href="/account"
              className="p-2 text-text-primary hover:text-primary transition-colors flex items-center gap-2"
            >
              <User size={20} />
              <span className="hidden lg:block text-sm font-medium truncate max-w-[100px]">
                {user?.firstName}
              </span>
            </Link>
          ) : (
            <Link href="/login" className="hidden md:flex">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
          )}

          <button
            onClick={openCart}
            className="p-2 text-text-primary hover:text-primary transition-colors relative"
          >
            <ShoppingCart size={20} />
            {itemCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-accent text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
