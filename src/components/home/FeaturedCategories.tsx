import React from 'react';
import Link from 'next/link';

const CATEGORIES = [
  { id: '1', name: 'Mattresses', slug: 'mattresses', image: 'https://images.unsplash.com/photo-1631679700053-14c861c88a87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: '2', name: 'Pillows', slug: 'pillows', image: 'https://images.unsplash.com/photo-1584100936595-c0654b35a146?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: '3', name: 'Furniture', slug: 'furniture', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: '4', name: 'Beddings', slug: 'beddings', image: 'https://images.unsplash.com/photo-1629949009765-4fa81ba316ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
];

export const FeaturedCategories = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container">
        <h2 className="text-3xl font-playfair font-bold text-center mb-10 text-primary">Shop by Category</h2>
        
        {/* Mobile: Horizontally scrollable, Desktop: Grid */}
        <div className="flex overflow-x-auto md:grid md:grid-cols-4 gap-6 pb-4 snap-x snap-mandatory hide-scrollbar">
          {CATEGORIES.map((cat) => (
            <Link 
              href={`/categories/${cat.slug}`} 
              key={cat.id}
              className="flex-shrink-0 w-64 md:w-auto snap-center group relative h-80 rounded-xl overflow-hidden block"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${cat.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <h3 className="text-white text-xl font-bold font-playfair mb-1">{cat.name}</h3>
                <span className="text-white/80 text-sm font-medium group-hover:text-accent transition-colors flex items-center gap-1">
                  Explore <span className="transform transition-transform group-hover:translate-x-1">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
