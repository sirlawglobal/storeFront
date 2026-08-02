import React from 'react';
import { ProductVariant } from '@/types';

interface ProductVariantsProps {
  variants: ProductVariant[];
  selectedVariantId?: string;
  onSelect: (variant: ProductVariant) => void;
}

export const ProductVariants: React.FC<ProductVariantsProps> = ({ variants, selectedVariantId, onSelect }) => {
  if (!variants || variants.length === 0) return null;

  // Group variants by attributes (e.g., Size, Color, Firmness)
  // For simplicity, we just display them as a list of buttons if they have a 'name'
  // Or we can extract specific attributes if we know the schema.
  
  return (
    <div className="mb-6">
      <h3 className="font-semibold text-text-primary mb-3">Options:</h3>
      <div className="flex flex-wrap gap-3">
        {variants.map((variant) => {
          const isSelected = selectedVariantId === variant._id;
          const isOutOfStock = variant.stockQuantity <= 0;
          
          return (
            <button
              key={variant._id}
              onClick={() => !isOutOfStock && onSelect(variant)}
              disabled={isOutOfStock}
              className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
                isSelected 
                  ? 'border-primary bg-primary text-white' 
                  : isOutOfStock
                    ? 'border-border bg-gray-50 text-gray-400 cursor-not-allowed line-through'
                    : 'border-border text-text-primary hover:border-primary/50'
              }`}
            >
              {variant.name || `Variant ${variant.sku}`}
            </button>
          );
        })}
      </div>
    </div>
  );
};
