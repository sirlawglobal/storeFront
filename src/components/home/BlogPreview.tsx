import React from 'react';
import Link from 'next/link';

const ARTICLES = [
  { id: '1', title: 'How to Choose the Perfect Mattress for Back Pain', slug: 'choose-perfect-mattress', image: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=500&q=80', date: 'Aug 1, 2026', tag: 'Sleep Health' },
  { id: '2', title: '5 Reasons You Need a Memory Foam Pillow', slug: 'memory-foam-pillow-benefits', image: 'https://images.unsplash.com/photo-1584100936595-c0654b35a146?w=500&q=80', date: 'Jul 28, 2026', tag: 'Wellness' },
  { id: '3', title: 'Transform Your Bedroom into a Sleep Sanctuary', slug: 'bedroom-sleep-sanctuary', image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=500&q=80', date: 'Jul 15, 2026', tag: 'Lifestyle' },
];

export const BlogPreview = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-playfair font-bold text-primary mb-2">Sleep Tips & Lifestyle</h2>
            <p className="text-text-secondary">Read our latest articles for a better night's rest.</p>
          </div>
          <Link href="/articles" className="hidden sm:inline-block text-primary font-medium hover:underline">
            View All Articles
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ARTICLES.map((article) => (
            <article key={article.id} className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <Link href={`/articles/${article.slug}`} className="block relative aspect-video overflow-hidden">
                <img 
                  src={article.image} 
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur text-xs font-semibold px-2 py-1 rounded text-primary">
                  {article.tag}
                </span>
              </Link>
              <div className="p-5">
                <p className="text-xs text-text-secondary mb-2">{article.date}</p>
                <Link href={`/articles/${article.slug}`}>
                  <h3 className="font-playfair text-xl font-bold text-primary mb-3 leading-tight group-hover:text-primary-light transition-colors">
                    {article.title}
                  </h3>
                </Link>
                <Link href={`/articles/${article.slug}`} className="text-sm font-semibold text-accent hover:underline">
                  Read Article →
                </Link>
              </div>
            </article>
          ))}
        </div>
        
        <div className="mt-8 text-center sm:hidden">
          <Link href="/articles" className="inline-block border border-border px-6 py-3 rounded-md font-medium text-text-primary hover:bg-gray-50">
            View All Articles
          </Link>
        </div>
      </div>
    </section>
  );
};
