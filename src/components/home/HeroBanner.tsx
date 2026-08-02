'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/Button';

// Static placeholder data for the banner - will be replaced with API call later
const BANNERS = [
  {
    id: '1',
    title: 'Experience The Ultimate Comfort',
    subtitle: 'Discover our new ortho-pedic mattress collection designed for perfect spine alignment.',
    image: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    ctaText: 'Shop Orthopedic',
    ctaLink: '/categories/mattresses',
    position: 'center'
  },
  {
    id: '2',
    title: 'Spring Sale is Here',
    subtitle: 'Up to 30% off selected bedroom furniture and sleep accessories.',
    image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    ctaText: 'View Deals',
    ctaLink: '/deals',
    position: 'left'
  }
];

export const HeroBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % BANNERS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrentIndex((prev) => (prev + 1) % BANNERS.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + BANNERS.length) % BANNERS.length);

  return (
    <div className="relative w-full h-[70vh] min-h-[500px] overflow-hidden bg-gray-900 group">
      {BANNERS.map((banner, index) => (
        <div 
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${banner.image})` }}
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Content */}
          <div className="container absolute inset-0 flex items-center justify-center md:justify-start">
            <div className={`text-white max-w-xl text-center md:text-left px-4 ${
              banner.position === 'center' ? 'mx-auto text-center md:text-center' : 'md:ml-12'
            }`}>
              <h2 className="font-playfair text-4xl md:text-6xl font-bold mb-4 leading-tight animate-fade-in-up">
                {banner.title}
              </h2>
              <p className="text-lg md:text-xl mb-8 text-gray-200 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                {banner.subtitle}
              </p>
              <Link href={banner.ctaLink} className="animate-fade-in-up inline-block" style={{ animationDelay: '200ms' }}>
                <Button size="lg" className="px-8">{banner.ctaText}</Button>
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Controls */}
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
        {BANNERS.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              idx === currentIndex ? 'bg-white' : 'bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
