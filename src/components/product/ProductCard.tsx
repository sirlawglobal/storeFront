'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { Button } from '../ui/Button';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import { useCartStore } from '@/store/cart.store';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const router = useRouter();
  const { isLoggedIn } = useAuthStore();
  const { setCart, openCart } = useCartStore();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [isCartLoading, setIsCartLoading] = useState(false);

  // Extract primary image URL safely (supports both string array & ProductImage object array)
  const rawImage = product.images?.[0];
  const imageUrl =
    typeof rawImage === 'string'
      ? rawImage
      : (rawImage as any)?.url || 'https://via.placeholder.com/400';

  // Extract price (supports top-level price or variant price)
  const basePrice = product.price ?? product.variants?.[0]?.price ?? 0;
  const salePrice = product.salePrice ?? product.variants?.[0]?.compareAtPrice;
  const isOnSale = !!salePrice && salePrice < basePrice;

  const reviewCount = product.reviewCount || 0;
  const rating = reviewCount > 0 ? (product.averageRating ?? (product as any).rating ?? 0) : 0;
  const defaultSku = product.variants?.[0]?.sku || `SKU-${product._id}`;

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      router.push(`/login?redirect=/products/${product.slug}`);
      return;
    }

    setIsWishlistLoading(true);
    try {
      if (isWishlisted) {
        await api.wishlist.removeItem(product._id);
        setIsWishlisted(false);
      } else {
        await api.wishlist.addItem(product._id);
        setIsWishlisted(true);
      }
    } catch (err: any) {
      console.error('Failed to update wishlist', err);
    } finally {
      setIsWishlistLoading(false);
    }
  };

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsCartLoading(true);
    try {
      const res: any = await api.cart.addItem({ sku: defaultSku, quantity: 1 });
      const updatedCart = res?.data ?? res;
      if (updatedCart) setCart(updatedCart);
      openCart();
    } catch (err) {
      console.error('Failed to quick add to cart', err);
    } finally {
      setIsCartLoading(false);
    }
  };

  return (
    <div className="group bg-white rounded-xl shadow-sm border border-border overflow-hidden flex flex-col h-full transition-shadow hover:shadow-md">
      {/* Image container */}
      <Link href={`/products/${product.slug}`} className="relative aspect-square overflow-hidden bg-gray-100 block">
        {isOnSale && (
          <div className="absolute top-2 left-2 z-10 bg-error text-white text-[10px] md:text-xs font-bold px-1.5 md:px-2 py-0.5 md:py-1 rounded shadow-xs">
            SALE
          </div>
        )}

        <button
          onClick={handleToggleWishlist}
          disabled={isWishlistLoading}
          className={`absolute top-2 right-2 z-10 w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center transition-all shadow-sm ${
            isWishlisted
              ? 'bg-white text-red-500 scale-100'
              : 'bg-white/80 backdrop-blur text-gray-500 hover:text-red-500 opacity-80'
          }`}
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart size={16} className={isWishlisted ? 'fill-red-500 text-red-500' : ''} />
        </button>

        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Quick Add Overlay (Desktop only) */}
        <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 hidden md:block bg-gradient-to-t from-black/50 to-transparent">
          <Button
            variant="primary"
            className="w-full shadow-lg text-sm"
            leftIcon={<ShoppingCart size={16} />}
            onClick={handleQuickAdd}
            isLoading={isCartLoading}
          >
            Quick Add
          </Button>
        </div>
      </Link>

      {/* Content */}
      <div className="p-3 md:p-4 flex flex-col flex-1">
        <div className="flex items-center gap-1 mb-1.5 md:mb-2">
          <Star size={12} className={reviewCount > 0 ? "fill-amber-400 text-amber-400" : "text-gray-300"} />
          <span className="text-[11px] md:text-xs font-medium text-text-primary">{Number(rating).toFixed(1)}</span>
          <span className="text-[11px] md:text-xs text-text-secondary">({reviewCount})</span>
        </div>

        <Link href={`/products/${product.slug}`}>
          <h3 className="font-medium text-xs md:text-sm text-text-primary hover:text-primary transition-colors line-clamp-2 mb-2">
            {product.name}
          </h3>
        </Link>

        <div className="mt-auto pt-1 md:pt-2 flex items-center justify-between gap-1">
          <div className="flex items-baseline gap-1 md:gap-2 flex-wrap">
            <span className="font-bold text-sm md:text-lg text-primary">{formatPrice(salePrice ?? basePrice)}</span>
            {isOnSale && (
              <span className="text-[10px] md:text-xs text-text-secondary line-through">{formatPrice(basePrice)}</span>
            )}
          </div>
          {/* Mobile Quick Add Button */}
          <button
            onClick={handleQuickAdd}
            disabled={isCartLoading}
            className="md:hidden w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center shrink-0 shadow-sm active:scale-95 transition-transform"
            title="Add to cart"
          >
            <ShoppingCart size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
