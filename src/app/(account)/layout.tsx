'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { User, Package, Heart, Bell, Settings, LogOut, ShieldCheck, MapPin } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { Header } from '@/components/layout/Header';
import { MobileDrawer } from '@/components/layout/MobileDrawer';
import { CartDrawer } from '@/components/cart/CartDrawer';

const NAV_ITEMS = [
  { name: 'Profile', href: '/account', icon: <User size={20} /> },
  { name: 'Orders', href: '/account/orders', icon: <Package size={20} /> },
  { name: 'Addresses', href: '/account/addresses', icon: <MapPin size={20} /> },
  { name: 'Wishlist', href: '/account/wishlist', icon: <Heart size={20} /> },
  { name: 'Notifications', href: '/account/notifications', icon: <Bell size={20} /> },
  { name: 'Warranty', href: '/account/warranty', icon: <ShieldCheck size={20} /> },
  { name: 'Preferences', href: '/account/preferences', icon: <Settings size={20} /> },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Basic client-side protection (middleware handles SSR protection)
  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) return null; // Avoid flash of protected content

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />
      <MobileDrawer isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      <main className="flex-1 container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex w-64 flex-col gap-2 shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-border p-4 mb-4">
            <h2 className="font-semibold text-lg mb-1">My Account</h2>
            <p className="text-sm text-text-secondary">Manage your orders and profile</p>
          </div>
          
          <nav className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
            <ul className="flex flex-col">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/account');
                return (
                  <li key={item.name}>
                    <Link 
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors border-l-2 ${
                        isActive 
                          ? 'border-primary bg-primary/5 text-primary' 
                          : 'border-transparent text-text-secondary hover:bg-gray-50 hover:text-text-primary'
                      }`}
                    >
                      {item.icon}
                      {item.name}
                    </Link>
                  </li>
                );
              })}
              <li>
                <button 
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-error hover:bg-red-50 transition-colors border-l-2 border-transparent text-left"
                >
                  <LogOut size={20} />
                  Sign Out
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Content Area */}
        <div className="flex-1 max-w-4xl pb-20 md:pb-0">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Tab Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-border shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-40 pb-safe">
        <ul className="flex justify-around items-center h-16">
          {[NAV_ITEMS[0], NAV_ITEMS[1], NAV_ITEMS[3], NAV_ITEMS[4]].map((item) => {
             const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/account');
             return (
              <li key={item.name} className="flex-1">
                <Link 
                  href={item.href}
                  className={`flex flex-col items-center justify-center h-full gap-1 ${
                    isActive ? 'text-primary' : 'text-text-secondary'
                  }`}
                >
                  {item.icon}
                  <span className="text-[10px] font-medium">{item.name}</span>
                </Link>
              </li>
             );
          })}
        </ul>
      </nav>
      <CartDrawer />
    </div>
  );
}
