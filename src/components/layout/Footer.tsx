import React from 'react';
import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="bg-[#111111] text-white pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12">
          
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <span className="font-playfair text-2xl font-bold tracking-tight text-white">
              Vitafoam
            </span>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Nigeria's leading manufacturer of flexible, reconstituted, and rigid foam products. Bringing you fine living.
            </p>
          </div>

          {/* Shop */}
          <div className="flex flex-col gap-3">
            <h4 className="font-semibold mb-2">Shop</h4>
            <Link href="/categories/mattresses" className="text-gray-400 hover:text-white text-sm transition-colors">Mattresses</Link>
            <Link href="/categories/pillows" className="text-gray-400 hover:text-white text-sm transition-colors">Pillows</Link>
            <Link href="/categories/furniture" className="text-gray-400 hover:text-white text-sm transition-colors">Furniture</Link>
            <Link href="/deals" className="text-gray-400 hover:text-white text-sm transition-colors">Promotions & Deals</Link>
          </div>

          {/* Support */}
          <div className="flex flex-col gap-3">
            <h4 className="font-semibold mb-2">Support</h4>
            <Link href="/account/support" className="text-gray-400 hover:text-white text-sm transition-colors">Help Center</Link>
            <Link href="/account/orders" className="text-gray-400 hover:text-white text-sm transition-colors">Track Order</Link>
            <Link href="/account/warranty" className="text-gray-400 hover:text-white text-sm transition-colors">Warranty Registration</Link>
            <Link href="/dealers" className="text-gray-400 hover:text-white text-sm transition-colors">Find a Store</Link>
          </div>

          {/* Company */}
          <div className="flex flex-col gap-3">
            <h4 className="font-semibold mb-2">Company</h4>
            <Link href="/about" className="text-gray-400 hover:text-white text-sm transition-colors">About Us</Link>
            <Link href="/articles" className="text-gray-400 hover:text-white text-sm transition-colors">Blog & Sleep Tips</Link>
            <Link href="/contact" className="text-gray-400 hover:text-white text-sm transition-colors">Contact Us</Link>
            <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">Terms & Conditions</Link>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm text-center md:text-left">
            &copy; {new Date().getFullYear()} Vitafoam Nigeria Plc. All rights reserved.
          </p>
          <div className="flex gap-4">
            {/* Social Links Placeholders */}
            <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-colors">FB</a>
            <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-colors">IG</a>
            <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-colors">TW</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
