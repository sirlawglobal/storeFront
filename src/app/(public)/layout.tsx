'use client';
import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { MobileDrawer } from '@/components/layout/MobileDrawer';
import { Footer } from '@/components/layout/Footer';
import { useCartStore } from '@/store/cart.store';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { ChatWidget } from '@/components/ui/ChatWidget';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isOpen: isCartOpen, closeCart } = useCartStore();

  return (
    <>
      <Header onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />
      <MobileDrawer isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      <main className="flex-1 w-full">
        {children}
      </main>

      <Footer />

      <CartDrawer />
      <ChatWidget />
    </>
  );
}
