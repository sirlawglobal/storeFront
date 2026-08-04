'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, ChevronRight, RefreshCw } from 'lucide-react';
import { api } from '@/lib/api';
import { Order } from '@/types';
import { formatPrice } from '@/lib/utils';

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  out_for_delivery: 'bg-orange-100 text-orange-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  refunded: 'bg-gray-100 text-gray-700',
};

function formatStatus(status: string) {
  return status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res: any = await api.orders.list({ page: 1, limit: 20 });
      // Backend returns { items: Order[], total: number } OR { data: { items: Order[] } } OR flat Order[]
      const rawList = res?.items ?? res?.data?.items ?? res?.data ?? res;
      setOrders(Array.isArray(rawList) ? rawList : []);
    } catch (err: any) {
      setError(err.message || 'Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const ref = urlParams.get('paymentRef') || urlParams.get('reference') || urlParams.get('trxref');
        if (ref) {
          try {
            await api.payments.verify(ref);
          } catch {
            // ignore verification errors if already verified
          }
        }
      }
      fetchOrders();
    };
    init();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-border p-6 md:p-8 min-h-[60vh]">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-playfair font-bold text-primary">Order History</h1>
        <button
          onClick={fetchOrders}
          className="text-text-secondary hover:text-primary transition-colors p-1"
          title="Refresh"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-error mb-4">{error}</p>
          <button onClick={fetchOrders} className="text-primary font-medium hover:underline">
            Try Again
          </button>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-lg text-text-primary font-medium mb-2">No orders yet</p>
          <p className="text-text-secondary mb-6">When you place an order, it will appear here.</p>
          <Link href="/products" className="text-primary font-medium hover:underline">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order: any) => {
            const statusKey = (order.orderStatus || order.status || 'pending').toLowerCase();
            const total = order.paymentSummary?.totalAmount ?? order.totalAmount ?? 0;
            const itemsCount = order.items?.length || 0;

            return (
              <Link
                key={order._id}
                href={`/account/orders/${order._id}`}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-border rounded-xl hover:border-primary/50 transition-colors group"
              >
                <div className="mb-3 sm:mb-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-bold">{order.orderNumber || order._id}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${
                        STATUS_STYLES[statusKey] || 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {formatStatus(statusKey)}
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary">
                    Placed on{' '}
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString('en-NG', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })
                      : 'N/A'}
                    {' • '}
                    {itemsCount} item{itemsCount > 1 ? 's' : ''}
                  </p>
                </div>

                <div className="flex items-center w-full sm:w-auto justify-between sm:justify-end gap-6 border-t sm:border-0 border-border pt-3 sm:pt-0">
                  <span className="font-bold text-lg">{formatPrice(total)}</span>
                  <ChevronRight size={20} className="text-gray-400 group-hover:text-primary transition-colors" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
