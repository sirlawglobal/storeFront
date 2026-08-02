'use client';
import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, CheckCircle2, Truck, PackageCheck, MapPin } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

// Mock timeline
const TIMELINE = [
  { label: 'Order Placed', date: 'Aug 2, 2026 10:30 AM', completed: true, icon: <CheckCircle2 size={24} /> },
  { label: 'Processing', date: 'Aug 2, 2026 02:15 PM', completed: true, icon: <PackageCheck size={24} /> },
  { label: 'Out for Delivery', date: 'Pending', completed: false, icon: <Truck size={24} /> },
  { label: 'Delivered', date: 'Pending', completed: false, icon: <MapPin size={24} /> },
];

export default function OrderDetailPage() {
  const { id } = useParams();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-border p-6 md:p-8">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/account/orders" className="text-text-secondary hover:text-primary transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-playfair font-bold text-primary">Order Details</h1>
      </div>

      <div className="flex flex-wrap justify-between items-start gap-4 mb-8 bg-gray-50 p-4 rounded-xl border border-gray-100">
        <div>
          <p className="text-sm text-text-secondary mb-1">Order Number</p>
          <p className="font-bold">{id}</p>
        </div>
        <div>
          <p className="text-sm text-text-secondary mb-1">Date Placed</p>
          <p className="font-medium">August 2, 2026</p>
        </div>
        <div>
          <p className="text-sm text-text-secondary mb-1">Total Amount</p>
          <p className="font-bold text-primary">{formatPrice(275000)}</p>
        </div>
        <div>
          <Button variant="outline" size="sm">Download Invoice</Button>
        </div>
      </div>

      {/* Tracking Timeline */}
      <div className="mb-12">
        <h3 className="font-semibold text-lg mb-6">Tracking Status</h3>
        
        {/* Desktop Horizontal */}
        <div className="hidden md:flex justify-between relative">
          <div className="absolute top-5 left-8 right-8 h-1 bg-gray-200 -z-10" />
          <div className="absolute top-5 left-8 w-1/3 h-1 bg-primary -z-10" />
          
          {TIMELINE.map((step, idx) => (
            <div key={idx} className="flex flex-col items-center w-32 text-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 transition-colors ${
                step.completed ? 'bg-primary text-white shadow-md' : 'bg-gray-100 text-gray-400'
              }`}>
                {step.icon}
              </div>
              <p className={`font-semibold text-sm mb-1 ${step.completed ? 'text-text-primary' : 'text-gray-400'}`}>{step.label}</p>
              <p className="text-xs text-text-secondary">{step.date}</p>
            </div>
          ))}
        </div>

        {/* Mobile Vertical */}
        <div className="md:hidden flex flex-col gap-6 relative ml-4">
          <div className="absolute top-4 bottom-4 left-[19px] w-0.5 bg-gray-200 -z-10" />
          <div className="absolute top-4 h-24 left-[19px] w-0.5 bg-primary -z-10" />
          
          {TIMELINE.map((step, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                step.completed ? 'bg-primary text-white shadow-md' : 'bg-gray-100 text-gray-400'
              }`}>
                {step.icon}
              </div>
              <div>
                <p className={`font-semibold text-sm ${step.completed ? 'text-text-primary' : 'text-gray-400'}`}>{step.label}</p>
                <p className="text-xs text-text-secondary">{step.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Items */}
      <h3 className="font-semibold text-lg mb-4">Items in this order</h3>
      <div className="border border-border rounded-xl divide-y divide-border mb-8">
        {[1, 2].map((i) => (
          <div key={i} className="p-4 flex gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded-lg shrink-0"></div>
            <div className="flex-1">
              <p className="font-medium text-text-primary">Vita Ortho Mattress</p>
              <p className="text-sm text-text-secondary">Size: 75x72x10</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">{formatPrice(125000)}</p>
              <p className="text-sm text-text-secondary">Qty: 1</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
