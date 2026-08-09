'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { X, User, Heart, Settings, LogOut, ChevronRight, Search, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '../ui/Button';
import { api } from '@/lib/api';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CategoryItem {
  _id: string;
  name: string;
  slug: string;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose }) => {
  const { isLoggedIn, user, logout } = useAuthStore();
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
        console.error('Failed to load mobile drawer categories', err);
      }
    };
    fetchCategories();
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-50 transition-opacity" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-white z-50 flex flex-col shadow-2xl transform transition-transform duration-300 ease-in-out">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <span className="font-playfair text-xl font-bold text-primary tracking-tight">
            Vitafoam
          </span>
          <button
            onClick={onClose}
            className="p-2 text-text-secondary hover:text-primary rounded-full hover:bg-gray-100"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoggedIn ? (
            <div className="p-4 border-b border-border bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                  {user?.firstName?.[0] || 'U'}
                </div>
                <div>
                  <p className="font-medium">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-sm text-text-secondary">{user?.email}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 border-b border-border">
              <p className="text-sm text-text-secondary mb-3">Sign in for the best experience</p>
              <div className="flex gap-2">
                <Link href="/login" onClick={onClose} className="flex-1">
                  <Button className="w-full">Sign In</Button>
                </Link>
                <Link href="/register" onClick={onClose} className="flex-1">
                  <Button variant="outline" className="w-full">
                    Create Account
                  </Button>
                </Link>
              </div>
            </div>
          )}

          <nav className="p-2">
            <ul className="space-y-1">
              <li>
                <Link
                  href="/search"
                  onClick={onClose}
                  className="flex items-center justify-between p-3 rounded-md hover:bg-gray-50 text-primary font-medium bg-primary/5"
                >
                  <span className="flex items-center gap-2">
                    <Search size={18} className="text-primary" />
                    Search Products
                  </span>
                  <ChevronRight size={16} className="text-primary" />
                </Link>
              </li>

              <li>
                <Link
                  href="/products"
                  onClick={onClose}
                  className="flex items-center justify-between p-3 rounded-md hover:bg-gray-50 text-text-primary font-medium"
                >
                  Shop All Products <ChevronRight size={16} className="text-text-secondary" />
                </Link>
              </li>

              {categories.map((cat) => (
                <li key={cat._id}>
                  <Link
                    href={`/products?category=${cat.slug}`}
                    onClick={onClose}
                    className="flex items-center justify-between p-3 rounded-md hover:bg-gray-50 text-text-primary font-medium capitalize"
                  >
                    {cat.name} <ChevronRight size={16} className="text-text-secondary" />
                  </Link>
                </li>
              ))}

              <li>
                <Link
                  href="/deals"
                  onClick={onClose}
                  className="flex items-center justify-between p-3 rounded-md hover:bg-gray-50 text-accent font-medium"
                >
                  Deals &amp; Offers <ChevronRight size={16} className="text-accent" />
                </Link>
              </li>
              <li>
                <Link
                  href="/sleep-quiz"
                  onClick={onClose}
                  className="flex items-center justify-between p-3 rounded-md hover:bg-gray-50 text-text-primary font-medium"
                >
                  AI Sleep Quiz <ChevronRight size={16} className="text-text-secondary" />
                </Link>
              </li>
            </ul>
          </nav>

          {isLoggedIn && (
            <>
              <div className="h-px bg-border my-2" />
              <nav className="p-2">
                <h3 className="px-3 py-2 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  My Account
                </h3>
                <ul className="space-y-1">
                  <li>
                    <Link
                      href="/account/orders"
                      onClick={onClose}
                      className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-50 text-text-primary"
                    >
                      <User size={18} className="text-text-secondary" /> Orders &amp; Tracking
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/account/wishlist"
                      onClick={onClose}
                      className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-50 text-text-primary"
                    >
                      <Heart size={18} className="text-text-secondary" /> Wishlist
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/account/warranty"
                      onClick={onClose}
                      className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-50 text-text-primary"
                    >
                      <ShieldCheck size={18} className="text-text-secondary" /> Warranty Center
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/account/preferences"
                      onClick={onClose}
                      className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-50 text-text-primary"
                    >
                      <Settings size={18} className="text-text-secondary" /> Preferences
                    </Link>
                  </li>
                </ul>
              </nav>
            </>
          )}
        </div>

        {isLoggedIn && (
          <div className="p-4 border-t border-border">
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="flex items-center justify-center gap-2 w-full p-3 text-error font-medium hover:bg-red-50 rounded-md transition-colors"
            >
              <LogOut size={18} /> Sign Out
            </button>
          </div>
        )}
      </div>
    </>
  );
};
