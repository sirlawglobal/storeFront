'use client';
import React from 'react';
import Link from 'next/link';
import { Package, ChevronRight } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

// Mock order data
const MOCK_ORDERS = [
  { id: 'ORD-2026-8923', date: 'Aug 2, 2026', total: 275000, status: 'Processing', items: 2 },
  { id: 'ORD-2026-8104', date: 'Jul 15, 2026', total: 150000, status: 'Delivered', items: 1 },
];

export default function OrdersPage() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-border p-6 md:p-8 min-h-[60vh]">
      <h1 className="text-2xl font-playfair font-bold text-primary mb-8">Order History</h1>

      {MOCK_ORDERS.length === 0 ? (
        <div className="text-center py-12">
          <Package className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-lg text-text-primary font-medium mb-2">No orders yet</p>
          <p className="text-text-secondary mb-6">When you place an order, it will appear here.</p>
          <Link href="/products" className="text-primary font-medium hover:underline">Start Shopping</Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {MOCK_ORDERS.map((order) => (
            <Link 
              key={order.id} 
              href={`/account/orders/${order.id}`}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-border rounded-xl hover:border-primary/50 transition-colors group"
            >
              <div className="mb-3 sm:mb-0">
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-bold">{order.id}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <p className="text-sm text-text-secondary">
                  Placed on {order.date} • {order.items} item{order.items > 1 ? 's' : ''}
                </p>
              </div>
              
              <div className="flex items-center w-full sm:w-auto justify-between sm:justify-end gap-6 border-t sm:border-0 border-border pt-3 sm:pt-0">
                <span className="font-bold text-lg">{formatPrice(order.total)}</span>
                <ChevronRight size={20} className="text-gray-400 group-hover:text-primary transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
