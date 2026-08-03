import React from 'react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container max-w-3xl">
        <h1 className="font-playfair text-4xl font-bold text-primary mb-6">Contact Us</h1>
        <p className="text-text-secondary text-lg leading-relaxed mb-8">
          We&apos;d love to hear from you. Reach out to us through any of the channels below.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl p-6 border border-border">
            <h2 className="font-semibold text-primary mb-2">Customer Support</h2>
            <p className="text-text-secondary text-sm">support@vitafoam.com.ng</p>
            <p className="text-text-secondary text-sm">+234 800 000 0000</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-border">
            <h2 className="font-semibold text-primary mb-2">Head Office</h2>
            <p className="text-text-secondary text-sm">Vitafoam Nigeria Plc</p>
            <p className="text-text-secondary text-sm">Ikeja, Lagos, Nigeria</p>
          </div>
        </div>
      </div>
    </div>
  );
}
