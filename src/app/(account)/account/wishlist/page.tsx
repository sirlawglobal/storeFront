'use client';
import React, { useEffect, useState } from 'react';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/store/cart.store';

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [movingId, setMovingId] = useState<string | null>(null);
  const { openCart, setCart } = useCartStore();

  const fetchWishlist = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res: any = await api.wishlist.get();
      const raw = res?.data ?? res;
      const items = raw?.items ?? (Array.isArray(raw) ? raw : []);

      // Extract product objects safely whether items is Product[] or { productId: Product }[]
      const products: Product[] = items
        .map((item: any) => {
          if (!item) return null;
          if (item.productId && typeof item.productId === 'object') {
            return {
              ...item.productId,
              _id: item.productId._id || item.productId.id,
            };
          }
          return item;
        })
        .filter((p: any) => p && (p._id || p.id));

      setWishlist(products);
    } catch (err: any) {
      setError(err.message || 'Failed to load wishlist');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (productId: string) => {
    try {
      await api.wishlist.removeItem(productId);
      setWishlist((prev) => prev.filter((p) => p._id !== productId));
    } catch (err: any) {
      alert(err.message || 'Failed to remove item');
    }
  };

  const handleMoveToCart = async (productId: string, product: Product) => {
    setMovingId(productId);
    try {
      const defaultSku = product.variants?.[0]?.sku || `SKU-${productId}`;
      const res: any = await api.cart.addItem({ sku: defaultSku, quantity: 1 });
      const updatedCart = res?.data ?? res;
      if (updatedCart) setCart(updatedCart);

      await api.wishlist.removeItem(productId);
      setWishlist((prev) => prev.filter((p) => p._id !== productId));
      openCart();
    } catch (err: any) {
      alert(err.message || 'Failed to move item to cart');
    } finally {
      setMovingId(null);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-border p-6 md:p-8 min-h-[60vh]">
      <h1 className="text-2xl font-playfair font-bold text-primary mb-8 flex items-center gap-2">
        <Heart size={22} className="text-primary fill-primary/10" /> My Wishlist ({wishlist.length})
      </h1>

      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-56 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-error mb-4">{error}</p>
          <button onClick={fetchWishlist} className="text-primary font-medium hover:underline cursor-pointer">
            Try Again
          </button>
        </div>
      ) : wishlist.length === 0 ? (
        <div className="text-center py-12 text-text-secondary">
          <Heart size={48} className="mx-auto text-gray-200 mb-4" />
          <p className="text-lg font-medium text-text-primary mb-2">Your wishlist is empty</p>
          <p className="text-sm mb-6">Save items you love to view them here.</p>
          <Link href="/products" className="text-primary font-semibold hover:underline">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {wishlist.map((product) => {
            const rawImage = product.images?.[0];
            const imageUrl =
              typeof rawImage === 'string'
                ? rawImage
                : (rawImage as any)?.url || 'https://via.placeholder.com/400';
            const price = product.salePrice ?? product.price ?? product.variants?.[0]?.price ?? 0;

            return (
              <div
                key={product._id}
                className="border border-border rounded-xl overflow-hidden group hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <Link href={`/products/${product.slug}`} className="block">
                  <div className="aspect-square bg-gray-50 overflow-hidden">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Heart size={32} className="text-gray-200" />
                      </div>
                    )}
                  </div>
                </Link>

                <div className="p-3 flex flex-col flex-1 justify-between">
                  <div>
                    <Link href={`/products/${product.slug}`}>
                      <p className="font-medium text-sm text-text-primary truncate hover:text-primary transition-colors">
                        {product.name}
                      </p>
                    </Link>
                    <p className="font-bold text-primary mt-1">{formatPrice(price)}</p>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleMoveToCart(product._id, product)}
                      disabled={movingId === product._id}
                      className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      <ShoppingCart size={14} />
                      {movingId === product._id ? 'Moving...' : 'Move to Cart'}
                    </button>
                    <button
                      onClick={() => handleRemove(product._id)}
                      className="p-2 border border-border rounded-lg text-text-secondary hover:text-error hover:border-error transition-colors cursor-pointer"
                      title="Remove from Wishlist"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
