import React from 'react';
import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="font-playfair text-3xl font-bold text-primary tracking-tight">
              Vitafoam
            </span>
          </Link>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg border border-border overflow-hidden">
          {children}
        </div>
        
        <div className="mt-8 text-center text-sm text-text-secondary">
          <p>&copy; {new Date().getFullYear()} Vitafoam Nigeria Plc. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
