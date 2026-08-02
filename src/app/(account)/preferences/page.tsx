'use client';
import React, { useState } from 'react';
import { Bell, Mail, Smartphone } from 'lucide-react';

export default function PreferencesPage() {
  const [preferences, setPreferences] = useState({
    newsletter: true,
    promotions: true,
    orderUpdatesEmail: true,
    orderUpdatesSms: false,
    newProducts: false,
  });

  const toggle = (key: keyof typeof preferences) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-border p-6 md:p-8">
      <h1 className="text-2xl font-playfair font-bold text-primary mb-8">Notification Preferences</h1>

      <div className="space-y-8">
        {/* Email Preferences */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Mail className="text-text-secondary" size={20} />
            <h2 className="font-semibold text-lg">Email Notifications</h2>
          </div>
          
          <div className="space-y-4 pl-7">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="font-medium text-sm text-text-primary">Order Updates</p>
                <p className="text-xs text-text-secondary">Get emails about your order status</p>
              </div>
              <input type="checkbox" checked={preferences.orderUpdatesEmail} onChange={() => toggle('orderUpdatesEmail')} className="w-5 h-5 accent-primary" />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="font-medium text-sm text-text-primary">Newsletters</p>
                <p className="text-xs text-text-secondary">Weekly tips for better sleep</p>
              </div>
              <input type="checkbox" checked={preferences.newsletter} onChange={() => toggle('newsletter')} className="w-5 h-5 accent-primary" />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="font-medium text-sm text-text-primary">Promotions & Deals</p>
                <p className="text-xs text-text-secondary">Exclusive discounts and offers</p>
              </div>
              <input type="checkbox" checked={preferences.promotions} onChange={() => toggle('promotions')} className="w-5 h-5 accent-primary" />
            </label>
          </div>
        </div>

        <hr className="border-border" />

        {/* SMS Preferences */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Smartphone className="text-text-secondary" size={20} />
            <h2 className="font-semibold text-lg">SMS Notifications</h2>
          </div>
          
          <div className="space-y-4 pl-7">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="font-medium text-sm text-text-primary">Order Delivery Updates</p>
                <p className="text-xs text-text-secondary">Text messages when your order is out for delivery</p>
              </div>
              <input type="checkbox" checked={preferences.orderUpdatesSms} onChange={() => toggle('orderUpdatesSms')} className="w-5 h-5 accent-primary" />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
