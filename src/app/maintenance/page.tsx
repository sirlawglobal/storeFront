import React from 'react';
import Link from 'next/link';
import { Settings, Mail, Phone } from 'lucide-react';

export default function MaintenancePage() {
  return (
    <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden border border-border">
      {/* Top Banner Area */}
      <div className="bg-primary/5 p-8 flex flex-col items-center justify-center text-center border-b border-border relative overflow-hidden">
        {/* Abstract background elements */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 bg-white p-4 rounded-2xl shadow-sm mb-6 inline-flex border border-border">
          <Settings size={48} className="text-primary animate-[spin_4s_linear_infinite]" />
        </div>
        
        <h1 className="text-3xl md:text-4xl font-playfair font-bold text-primary mb-3 relative z-10">
          We'll be back soon!
        </h1>
        <p className="text-text-secondary text-base md:text-lg max-w-lg relative z-10">
          We are currently performing scheduled maintenance to improve your Vitafoam experience. 
        </p>
      </div>

      {/* Content Area */}
      <div className="p-8 md:p-10 text-center">
        <p className="text-text-primary mb-8 leading-relaxed">
          Our team is working hard to bring the site back online as quickly as possible. 
          We apologize for any inconvenience this may cause and appreciate your patience.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a 
            href="mailto:support@vitafoam.com.ng" 
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-gray-50 hover:bg-gray-100 text-text-primary rounded-xl font-medium transition-colors border border-border"
          >
            <Mail size={18} className="text-primary" />
            <span>Email Support</span>
          </a>
          <a 
            href="tel:+234700VITAFOAM" 
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-gray-50 hover:bg-gray-100 text-text-primary rounded-xl font-medium transition-colors border border-border"
          >
            <Phone size={18} className="text-primary" />
            <span>Call Us</span>
          </a>
        </div>
      </div>
      
      {/* Footer Area */}
      <div className="bg-gray-50 p-6 text-center border-t border-border">
        <p className="text-xs text-text-secondary">
          &copy; {new Date().getFullYear()} Vitafoam Nigeria Plc. All rights reserved.
        </p>
      </div>
    </div>
  );
}
