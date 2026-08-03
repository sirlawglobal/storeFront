'use client';
import React from 'react';
import { useParams } from 'next/navigation';

export default function OrderDetailPage() {
  const { id } = useParams();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-border p-6 md:p-8 min-h-[60vh]">
      <h1 className="text-2xl font-playfair font-bold text-primary mb-2">Order Details</h1>
      <p className="text-text-secondary mb-8">Order ID: {id}</p>
      <p className="text-text-secondary">Order details coming soon.</p>
    </div>
  );
}
