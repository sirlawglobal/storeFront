'use client';
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductImagesProps {
  images: string[];
  productName: string;
}

export const ProductImages: React.FC<ProductImagesProps> = ({ images, productName }) => {
  const [mainImageIndex, setMainImageIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-gray-100 rounded-2xl flex items-center justify-center">
        <span className="text-gray-400">No Image Available</span>
      </div>
    );
  }

  const nextImage = () => setMainImageIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setMainImageIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="relative aspect-square md:aspect-[4/3] bg-gray-50 rounded-2xl overflow-hidden group">
        <img 
          src={images[mainImageIndex]} 
          alt={`${productName} - View ${mainImageIndex + 1}`}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110 cursor-zoom-in"
        />
        
        {/* Mobile Swipe / Arrow Controls */}
        {images.length > 1 && (
          <>
            <button 
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex flex-col items-center justify-center shadow-md md:opacity-0 md:group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft size={20} className="text-gray-700" />
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex flex-col items-center justify-center shadow-md md:opacity-0 md:group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight size={20} className="text-gray-700" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Strip (Desktop mainly) */}
      {images.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-2 snap-x hide-scrollbar">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setMainImageIndex(idx)}
              className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors snap-center ${
                idx === mainImageIndex ? 'border-primary' : 'border-transparent hover:border-gray-300'
              }`}
            >
              <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
