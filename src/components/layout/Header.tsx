import React from 'react';
import Link from 'next/link';
import { Search, ShoppingCart, User, Menu, Heart } from 'lucide-react';
import { useCartStore } from '@/store/cart.store';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '../ui/Button';

interface HeaderProps {
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu }) => {
  const { itemCount, openCart } = useCartStore();
  const { isLoggedIn, user } = useAuthStore();

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
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/products" className="text-sm font-medium hover:text-primary transition-colors">Shop</Link>
          <Link href="/categories/mattresses" className="text-sm font-medium hover:text-primary transition-colors">Mattresses</Link>
          <Link href="/deals" className="text-sm font-medium text-accent hover:opacity-80 transition-opacity">Deals</Link>
          <Link href="/sleep-quiz" className="text-sm font-medium hover:text-primary transition-colors">Sleep Quiz</Link>
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
            <Link href="/account" className="p-2 text-text-primary hover:text-primary transition-colors flex items-center gap-2">
              <User size={20} />
              <span className="hidden lg:block text-sm font-medium truncate max-w-[100px]">
                {user?.firstName}
              </span>
            </Link>
          ) : (
            <Link href="/login" className="hidden md:flex">
              <Button variant="ghost" size="sm">Sign In</Button>
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
