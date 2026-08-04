'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Package,
  MapPin,
  CreditCard,
  CheckCircle2,
  Clock,
  XCircle,
  Truck,
} from 'lucide-react';
import { api } from '@/lib/api';
import { Order, OrderTracking } from '@/types';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

const STATUS_STYLES: Record<string, { color: string; icon: React.ReactNode }> = {
  pending: { color: 'text-yellow-600 bg-yellow-50 border-yellow-200', icon: <Clock size={16} /> },
  confirmed: { color: 'text-blue-600 bg-blue-50 border-blue-200', icon: <CheckCircle2 size={16} /> },
  processing: { color: 'text-blue-600 bg-blue-50 border-blue-200', icon: <Package size={16} /> },
  shipped: { color: 'text-purple-600 bg-purple-50 border-purple-200', icon: <Truck size={16} /> },
  out_for_delivery: { color: 'text-orange-600 bg-orange-50 border-orange-200', icon: <Truck size={16} /> },
  delivered: { color: 'text-green-600 bg-green-50 border-green-200', icon: <CheckCircle2 size={16} /> },
  cancelled: { color: 'text-red-600 bg-red-50 border-red-200', icon: <XCircle size={16} /> },
  refunded: { color: 'text-gray-600 bg-gray-50 border-gray-200', icon: <XCircle size={16} /> },
};

function formatStatus(status: string) {
  return status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [order, setOrder] = useState<Order | null>(null);
  const [tracking, setTracking] = useState<OrderTracking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError('');
      try {
        const [orderRes, trackingRes]: any[] = await Promise.allSettled([
          api.orders.getById(id),
          api.orders.getTracking(id),
        ]);

        if (orderRes.status === 'fulfilled') {
          const o = orderRes.value?.data ?? orderRes.value;
          setOrder(o);
        } else {
          setError(orderRes.reason?.message || 'Order not found');
        }

        if (trackingRes.status === 'fulfilled') {
          const t = trackingRes.value?.data ?? trackingRes.value;
          setTracking(Array.isArray(t) ? t : []);
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (id) load();
  }, [id]);

  const handleCancel = async () => {
    if (!order) return;
    const reason = window.prompt('Please provide a reason for cancellation:');
    if (!reason) return;

    setIsCancelling(true);
    try {
      await api.orders.cancel(order._id, { reason });
      setOrder((prev) => prev ? { ...prev, status: 'cancelled' } : null);
    } catch (err: any) {
      alert(err.message || 'Failed to cancel order');
    } finally {
      setIsCancelling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-border p-6 md:p-8 min-h-[60vh] animate-pulse space-y-4">
        <div className="h-8 w-48 bg-gray-200 rounded" />
        <div className="h-4 w-64 bg-gray-100 rounded" />
        <div className="h-32 bg-gray-100 rounded-xl mt-8" />
        <div className="h-32 bg-gray-100 rounded-xl" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-border p-6 md:p-8 min-h-[60vh] flex flex-col items-center justify-center">
        <Package size={48} className="text-gray-300 mb-4" />
        <p className="text-lg text-text-primary font-medium mb-2">Order Not Found</p>
        <p className="text-text-secondary mb-6">{error || 'This order could not be loaded.'}</p>
        <Link href="/account/orders" className="text-primary font-medium hover:underline">
          Back to Orders
        </Link>
      </div>
    );
  }

  const statusKey = (order.orderStatus || order.status || 'pending').toLowerCase();
  const statusInfo = STATUS_STYLES[statusKey] || STATUS_STYLES.pending;
  const isCancellable = ['pending', 'confirmed'].includes(statusKey);

  const subtotal = order.paymentSummary?.subTotal ?? order.subtotal ?? 0;
  const discount = order.paymentSummary?.discountAmount ?? order.totalDiscount ?? 0;
  const tax = order.paymentSummary?.taxAmount ?? order.taxAmount ?? 0;
  const total = order.paymentSummary?.totalAmount ?? order.totalAmount ?? 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-border p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => router.push('/account/orders')}
            className="text-text-secondary hover:text-primary transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-playfair font-bold text-primary">
              Order {order.orderNumber || order._id.slice(-8).toUpperCase()}
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              Placed on{' '}
              {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-NG', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              }) : 'N/A'}
            </p>
          </div>
          <span
            className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full border ${statusInfo.color}`}
          >
            {statusInfo.icon}
            {formatStatus(statusKey)}
          </span>
        </div>

        {isCancellable && (
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              isLoading={isCancelling}
              className="text-error border-error hover:bg-red-50"
            >
              Cancel Order
            </Button>
          </div>
        )}
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-xl shadow-sm border border-border p-6 md:p-8">
        <h2 className="font-semibold text-lg mb-4 pb-3 border-b border-border">Items Ordered</h2>
        <div className="space-y-4">
          {order.items?.map((item: any, idx: number) => {
            const img = item.primaryImage || item.image;
            return (
              <div key={idx} className="flex gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-lg border border-border overflow-hidden shrink-0 flex items-center justify-center">
                  {img ? (
                    <img src={img} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <Package size={24} className="text-gray-300" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-text-primary">{item.name}</p>
                  {item.variantName && (
                    <p className="text-xs text-text-secondary">{item.variantName}</p>
                  )}
                  <p className="text-xs text-text-secondary">SKU: {item.sku}</p>
                  <p className="text-sm mt-1">
                    {formatPrice(item.price)} × {item.quantity}
                  </p>
                </div>
                <div className="text-right font-bold">
                  {formatPrice(item.price * item.quantity)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Totals */}
        <div className="mt-6 pt-4 border-t border-border space-y-2 text-sm">
          <div className="flex justify-between text-text-secondary">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-success">
              <span>Discount</span>
              <span>-{formatPrice(discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-text-secondary">
            <span>Estimated Tax</span>
            <span>{formatPrice(tax)}</span>
          </div>
          <div className="flex justify-between font-bold text-base pt-2 border-t border-border">
            <span>Total</span>
            <span className="text-primary">{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      {/* Shipping + Payment info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {order.shippingAddress && (
          <div className="bg-white rounded-xl shadow-sm border border-border p-6">
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <MapPin size={18} className="text-primary" /> Delivery Address
            </h2>
            <p className="font-medium">{order.shippingAddress.label}</p>
            <p className="text-text-secondary text-sm">{order.shippingAddress.street}</p>
            <p className="text-text-secondary text-sm">
              {order.shippingAddress.city}, {order.shippingAddress.state}
            </p>
            {order.shippingAddress.country && (
              <p className="text-text-secondary text-sm">{order.shippingAddress.country}</p>
            )}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-border p-6">
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <CreditCard size={18} className="text-primary" /> Payment
          </h2>
          <p className="text-text-secondary text-sm capitalize">
            Method: <span className="font-medium text-text-primary">{order.paymentMethod || 'N/A'}</span>
          </p>
          <p className="text-text-secondary text-sm mt-2">
            Status:{' '}
            <span className={`font-medium ${order.status === 'cancelled' ? 'text-error' : 'text-success'}`}>
              {order.status === 'delivered' ? 'Paid' : order.status === 'cancelled' ? 'Refunded' : 'Paid'}
            </span>
          </p>
        </div>
      </div>

      {/* Tracking Timeline */}
      {tracking.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-border p-6 md:p-8">
          <h2 className="font-semibold text-lg mb-6 flex items-center gap-2">
            <Truck size={18} className="text-primary" /> Tracking Timeline
          </h2>
          <ol className="relative border-l border-border ml-3">
            {tracking.map((event, idx) => (
              <li key={idx} className="mb-6 ml-6 last:mb-0">
                <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-primary rounded-full ring-4 ring-white">
                  <CheckCircle2 size={12} className="text-white" />
                </span>
                <h3 className="font-semibold text-text-primary">{event.status}</h3>
                {event.location && (
                  <p className="text-sm text-text-secondary">{event.location}</p>
                )}
                <p className="text-sm text-text-secondary">{event.description}</p>
                <time className="text-xs text-text-secondary">
                  {new Date(event.timestamp).toLocaleString('en-NG')}
                </time>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
