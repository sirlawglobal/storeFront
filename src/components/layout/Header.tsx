'use client';
import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Search, ShoppingCart, User, Menu, Heart, ChevronDown, Grid, Bell } from 'lucide-react';
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
  description?: string;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu }) => {
  const { itemCount, openCart } = useCartStore();
  const { isLoggedIn, user } = useAuthStore();
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [unreadNotifications, setUnreadNotifications] = useState(0);

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

    if (isLoggedIn) {
      const fetchUnread = async () => {
        try {
          const res: any = await api.notifications.getUnreadCount();
          const count = res?.data?.count ?? res?.count ?? 0;
          setUnreadNotifications(Number(count) || 0);
        } catch (e) {
          // ignore notification count fetch error
        }
      };
      fetchUnread();
    }
  }, [isLoggedIn]);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsCategoryDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsCategoryDropdownOpen(false);
    }, 150); // Gentle 150ms buffer so moving cursor into dropdown menu is 100% smooth
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-border shadow-xs">
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
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/products"
            className="text-sm font-medium hover:text-primary transition-colors text-text-primary"
          >
            All Products
          </Link>

          {/* Categories Dropdown Container */}
          <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
              className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1.5 py-2 text-text-primary cursor-pointer"
            >
              <span>Categories</span>
              <ChevronDown
                size={15}
                className={`transition-transform duration-200 ${
                  isCategoryDropdownOpen ? 'rotate-180 text-primary' : 'text-gray-400'
                }`}
              />
            </button>

            {/* Seamless Dropdown Menu Wrapper (pt-2 acts as invisible hover bridge) */}
            <div
              className={`absolute top-full left-0 pt-2 w-64 transition-all duration-200 z-50 ${
                isCategoryDropdownOpen
                  ? 'opacity-100 visible translate-y-0'
                  : 'opacity-0 invisible -translate-y-2 pointer-events-none'
              }`}
            >
              <div className="bg-white border border-border rounded-2xl shadow-xl p-3">
                <div className="px-3 py-2 border-b border-border/60 mb-2 flex items-center gap-2">
                  <Grid size={15} className="text-primary" />
                  <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                    Shop By Category
                  </span>
                </div>

                {categories.length > 0 ? (
                  <div className="max-h-80 overflow-y-auto custom-scrollbar space-y-1">
                    {categories.map((cat) => (
                      <Link
                        key={cat._id}
                        href={`/products?category=${cat.slug}`}
                        onClick={() => setIsCategoryDropdownOpen(false)}
                        className="flex items-center justify-between px-3 py-2 text-sm font-medium text-text-primary hover:text-primary hover:bg-primary/5 rounded-xl transition-colors capitalize group/item"
                      >
                        <span>{cat.name}</span>
                        <span className="text-xs text-gray-400 group-hover/item:text-primary transition-colors">
                          →
                        </span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 text-center text-xs text-text-secondary">
                    <p className="mb-2">No custom categories found</p>
                    <Link
                      href="/products"
                      onClick={() => setIsCategoryDropdownOpen(false)}
                      className="text-primary font-semibold hover:underline"
                    >
                      Browse All Products
                    </Link>
                  </div>
                )}

                <div className="mt-2 pt-2 border-t border-border/60 text-center">
                  <Link
                    href="/products"
                    onClick={() => setIsCategoryDropdownOpen(false)}
                    className="text-xs font-semibold text-primary hover:underline block py-1"
                  >
                    View All Categories →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <Link href="/deals" className="text-sm font-medium text-accent hover:opacity-80 transition-opacity">
            Deals
          </Link>
          <Link href="/sleep-quiz" className="text-sm font-medium hover:text-primary transition-colors text-text-primary">
            Sleep Quiz
          </Link>
        </nav>

        {/* Action Icons */}
        <div className="flex items-center gap-2 md:gap-4">
          <Link href="/search" className="p-2 text-text-primary hover:text-primary transition-colors">
            <Search size={20} />
          </Link>

          <Link href="/account/wishlist" className="p-2 text-text-primary hover:text-primary transition-colors hidden md:block">
            <Heart size={20} />
          </Link>

          {isLoggedIn && (
            <Link
              href="/account/notifications"
              className="p-2 text-text-primary hover:text-primary transition-colors relative"
              title="Notifications"
            >
              <Bell size={20} />
              {unreadNotifications > 0 && (
                <span className="absolute top-1 right-1 bg-accent text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {unreadNotifications > 9 ? '9+' : unreadNotifications}
                </span>
              )}
            </Link>
          )}

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
