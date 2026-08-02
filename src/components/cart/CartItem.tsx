import React from 'react';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '@/types';
import { formatPrice } from '@/lib/utils';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (sku: string, newQty: number) => void;
  onRemove: (sku: string) => void;
}

export const CartItem: React.FC<CartItemProps> = ({ item, onUpdateQuantity, onRemove }) => {
  return (
    <div className="flex gap-4 py-4 border-b border-border">
      {/* Image */}
      <div className="w-20 h-20 md:w-24 md:h-24 shrink-0 bg-gray-100 rounded-lg overflow-hidden border border-border">
        {item.image ? (
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Image</div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div className="flex justify-between items-start gap-2">
          <div>
            <Link href={`/products/${item.productId}`} className="font-semibold text-text-primary hover:text-primary transition-colors line-clamp-2">
              {item.name}
            </Link>
            <p className="text-xs text-text-secondary mt-1">SKU: {item.sku}</p>
          </div>
          <p className="font-bold text-primary shrink-0">{formatPrice(item.price)}</p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center border border-border rounded-md w-max bg-white">
            <button 
              onClick={() => onUpdateQuantity(item.sku, Math.max(1, item.quantity - 1))}
              className="px-3 py-1 text-text-secondary hover:text-primary hover:bg-gray-50 disabled:opacity-50"
              disabled={item.quantity <= 1}
            >-</button>
            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
            <button 
              onClick={() => onUpdateQuantity(item.sku, item.quantity + 1)}
              className="px-3 py-1 text-text-secondary hover:text-primary hover:bg-gray-50"
            >+</button>
          </div>
          
          <button 
            onClick={() => onRemove(item.sku)}
            className="text-text-secondary hover:text-error transition-colors p-1"
            title="Remove item"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
