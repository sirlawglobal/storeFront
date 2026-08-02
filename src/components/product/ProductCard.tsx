import React from 'react';
import Link from 'next/link';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { Button } from '../ui/Button';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const isOnSale = !!product.salePrice && product.salePrice < product.price;

  return (
    <div className="group bg-white rounded-xl shadow-sm border border-border overflow-hidden flex flex-col h-full transition-shadow hover:shadow-md">
      {/* Image container */}
      <Link href={`/products/${product.slug}`} className="relative aspect-square overflow-hidden bg-gray-100 block">
        {isOnSale && (
          <div className="absolute top-3 left-3 z-10 bg-error text-white text-xs font-bold px-2 py-1 rounded">
            SALE
          </div>
        )}
        <button className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-gray-500 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
          <Heart size={16} />
        </button>
        <img 
          src={product.images?.[0] || 'https://via.placeholder.com/400'} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Quick Add Overlay (Desktop) */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 hidden md:block bg-gradient-to-t from-black/50 to-transparent">
          <Button variant="primary" className="w-full shadow-lg" leftIcon={<ShoppingCart size={18} />}>
            Quick Add
          </Button>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-1 mb-2">
          <Star size={14} className="fill-accent text-accent" />
          <span className="text-xs font-medium">{product.averageRating?.toFixed(1) || '0.0'}</span>
          <span className="text-xs text-text-secondary">({product.reviewCount || 0})</span>
        </div>
        
        <Link href={`/products/${product.slug}`} className="hover:text-primary transition-colors">
          <h3 className="font-semibold text-text-primary mb-1 line-clamp-1">{product.name}</h3>
        </Link>
        <p className="text-xs text-text-secondary mb-3">{product.brand}</p>
        
        <div className="mt-auto flex items-center gap-2">
          {isOnSale ? (
            <>
              <span className="font-bold text-primary">{formatPrice(product.salePrice!)}</span>
              <span className="text-sm text-text-secondary line-through">{formatPrice(product.price)}</span>
            </>
          ) : (
            <span className="font-bold text-primary">{formatPrice(product.price)}</span>
          )}
        </div>

        {/* Mobile Quick Add */}
        <Button variant="outline" size="sm" className="w-full mt-4 md:hidden">
          Add to Cart
        </Button>
      </div>
    </div>
  );
};
