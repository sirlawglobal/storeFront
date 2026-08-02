'use client';
import React from 'react';
import Link from 'next/link';

const ARTICLES = [
  { id: '1', title: 'How to Choose the Perfect Mattress for Back Pain', slug: 'choose-perfect-mattress', image: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=500&q=80', date: 'Aug 1, 2026', tag: 'Sleep Health', excerpt: 'Suffering from back pain? The right mattress can make all the difference. Discover what you need to look for.' },
  { id: '2', title: '5 Reasons You Need a Memory Foam Pillow', slug: 'memory-foam-pillow-benefits', image: 'https://images.unsplash.com/photo-1584100936595-c0654b35a146?w=500&q=80', date: 'Jul 28, 2026', tag: 'Wellness', excerpt: 'Memory foam pillows contour to your neck and head, providing unparalleled support and alignment.' },
  { id: '3', title: 'Transform Your Bedroom into a Sleep Sanctuary', slug: 'bedroom-sleep-sanctuary', image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=500&q=80', date: 'Jul 15, 2026', tag: 'Lifestyle', excerpt: 'Learn how lighting, temperature, and clutter affect your ability to fall asleep and stay asleep.' },
];

export default function ArticlesPage() {
  return (
    <div className="bg-white min-h-screen py-12">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl font-playfair font-bold text-primary mb-4">The Vitafoam Blog</h1>
          <p className="text-lg text-text-secondary">Expert advice, sleep tips, and lifestyle guides to help you achieve the rest you deserve.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ARTICLES.map((article) => (
            <article key={article.id} className="group flex flex-col">
              <Link href={`/articles/${article.slug}`} className="block relative aspect-[4/3] rounded-2xl overflow-hidden mb-5">
                <img 
                  src={article.image} 
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute top-4 left-4 bg-white/90 backdrop-blur text-xs font-semibold px-3 py-1.5 rounded-full text-primary">
                  {article.tag}
                </span>
              </Link>
              
              <div className="flex-1 flex flex-col">
                <p className="text-sm text-text-secondary mb-3">{article.date}</p>
                <Link href={`/articles/${article.slug}`}>
                  <h2 className="font-playfair text-2xl font-bold text-text-primary mb-3 leading-snug group-hover:text-primary transition-colors">
                    {article.title}
                  </h2>
                </Link>
                <p className="text-text-secondary mb-5 line-clamp-3">
                  {article.excerpt}
                </p>
                <Link href={`/articles/${article.slug}`} className="mt-auto text-primary font-semibold hover:underline">
                  Read Full Article →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
