'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { api } from '@/lib/api';

interface BannerItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  ctaText: string;
  ctaLink: string;
  position?: string;
  bannerType?: string;
}

const FALLBACK_BANNERS: BannerItem[] = [
  {
    id: '1',
    title: 'Experience The Ultimate Comfort',
    subtitle: 'Discover our new orthopedic mattress collection designed for perfect spine alignment.',
    image: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=2000&q=80',
    ctaText: 'Shop Orthopedic',
    ctaLink: '/products?category=mattresses',
    position: 'center',
  },
  {
    id: '2',
    title: 'Spring Sale is Here',
    subtitle: 'Up to 30% off selected bedroom furniture and sleep accessories.',
    image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=2000&q=80',
    ctaText: 'View Deals',
    ctaLink: '/products',
    position: 'left',
  },
];

export const HeroBanner = () => {
  const [banners, setBanners] = useState<BannerItem[]>(FALLBACK_BANNERS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      setIsLoading(true);
      try {
        const res: any = await api.banners.getActive();
        const payload = res?.data ?? res;
        const list = Array.isArray(payload) ? payload : (payload?.data ?? []);
        if (Array.isArray(list) && list.length > 0) {
          const dynamicBanners: BannerItem[] = list.map((b: any, idx: number) => ({
            id: b._id || String(idx),
            title: b.title || '',
            subtitle: b.subtitle || '',
            image: b.imageUrl || FALLBACK_BANNERS[idx % 2].image,
            ctaText: b.buttonText || 'Shop Now',
            ctaLink: b.targetUrl || '/products',
            position: idx % 2 === 0 ? 'center' : 'left',
            bannerType: b.bannerType || 'custom',
          }));
          setBanners(dynamicBanners);
        }
      } catch (err) {
        console.error('Failed to load active promotion banners:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBanners();
  }, []);

  // Auto-slide
  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const next = () => setCurrentIndex((prev) => (prev + 1) % banners.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);

  return (
    <div className="relative w-full h-[70vh] min-h-[500px] overflow-hidden bg-gray-900 group">
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* Background Image */}
          {banner.bannerType === 'image_only' && banner.ctaLink ? (
            <Link href={banner.ctaLink} className="absolute inset-0">
              <div
                className="absolute inset-0 bg-cover bg-center cursor-pointer"
                style={{ backgroundImage: `url(${banner.image})` }}
              />
            </Link>
          ) : (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${banner.image})` }}
            />
          )}

          {/* Overlay & Content (Only if not image_only) */}
          {banner.bannerType !== 'image_only' && (
            <>
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40 pointer-events-none" />

              {/* Content */}
              <div className="container absolute inset-0 flex items-center justify-center md:justify-start">
                <div
                  className={`text-white max-w-xl text-center md:text-left px-4 ${
                    banner.position === 'center' ? 'mx-auto text-center md:text-center' : 'md:ml-12'
                  }`}
                >
                  {banner.title && (
                    <h2 className="font-playfair text-4xl md:text-6xl font-bold mb-4 leading-tight animate-fade-in-up">
                      {banner.title}
                    </h2>
                  )}
                  {banner.subtitle && (
                    <p
                      className="text-lg md:text-xl mb-8 text-gray-200 animate-fade-in-up"
                      style={{ animationDelay: '100ms' }}
                    >
                      {banner.subtitle}
                    </p>
                  )}
                  {banner.ctaLink && banner.ctaText && (
                    <Link href={banner.ctaLink} className="animate-fade-in-up inline-block" style={{ animationDelay: '200ms' }}>
                      <Button size="lg" className="px-8 font-semibold">
                        {banner.ctaText}
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      ))}

      {/* Controls */}
      {banners.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight size={24} />
          </button>

          {/* Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  idx === currentIndex ? 'bg-white' : 'bg-white/40 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
