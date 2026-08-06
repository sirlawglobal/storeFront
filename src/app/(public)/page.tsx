import React from 'react';
import { PromoStrip } from '@/components/home/PromoStrip';
import { HeroBanner } from '@/components/home/HeroBanner';
import { FeaturedCategories } from '@/components/home/FeaturedCategories';
import { TrendingProducts } from '@/components/home/TrendingProducts';
import { AIRecommendations } from '@/components/home/AIRecommendations';
import { BlogPreview } from '@/components/home/BlogPreview';
import { SleepQuizModal } from '@/components/home/SleepQuizModal';

export default function HomePage() {
  return (
    <>
      <PromoStrip />
      <HeroBanner />
      <FeaturedCategories />
      <TrendingProducts />
      <AIRecommendations />
      <BlogPreview />
      <SleepQuizModal />
    </>
  );
}
