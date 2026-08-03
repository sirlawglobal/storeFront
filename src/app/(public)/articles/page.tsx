'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Calendar, Tag } from 'lucide-react';

interface Article {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: string;
  featuredImage?: string;
  tags?: string[];
  authorId?: { firstName?: string; lastName?: string } | string;
  publishedAt?: string;
  createdAt?: string;
  isPublished?: boolean;
}

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=800&q=80',
  'https://images.unsplash.com/photo-1584100936595-c0654b35a146?w=800&q=80',
  'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80',
];

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const fetchArticles = async (tag?: string) => {
    setIsLoading(true);
    try {
      const res: any = await api.articles.list({ tag, limit: 20 });
      const data = res?.data?.data ?? res?.data ?? res;
      setArticles(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load articles:', err);
      setArticles([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles(activeTag ?? undefined);
  }, [activeTag]);

  // Collect all unique tags from articles
  const allTags = Array.from(new Set(articles.flatMap((a) => a.tags ?? []))).filter(Boolean);

  const getImage = (article: Article, idx: number) =>
    article.coverImage || article.featuredImage || FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length];

  const getAuthorName = (article: Article) => {
    if (!article.authorId) return 'Vitafoam Editorial';
    if (typeof article.authorId === 'string') return 'Vitafoam Editorial';
    const a = article.authorId as { firstName?: string; lastName?: string };
    return [a.firstName, a.lastName].filter(Boolean).join(' ') || 'Vitafoam Editorial';
  };

  const formatDate = (article: Article) => {
    const dateStr = article.publishedAt || article.createdAt;
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-NG', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-white min-h-screen pb-16">
      {/* Hero Header */}
      <div className="bg-primary/5 border-b border-border py-12 md:py-16 px-4 text-center">
        <h1 className="text-3xl md:text-4xl font-playfair font-bold text-primary mb-3">
          The Vitafoam Blog
        </h1>
        <p className="text-sm md:text-base text-text-secondary max-w-xl mx-auto">
          Expert advice, sleep tips, and lifestyle guides to help you achieve the rest you deserve.
        </p>

        {/* Tag Filter Pills */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            <button
              onClick={() => setActiveTag(null)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                !activeTag
                  ? 'bg-primary text-white border-primary'
                  : 'border-border text-text-secondary hover:border-primary hover:text-primary'
              }`}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag === activeTag ? null : tag)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  activeTag === tag
                    ? 'bg-primary text-white border-primary'
                    : 'border-border text-text-secondary hover:border-primary hover:text-primary'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="container px-4 md:px-6 py-10 md:py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/3] bg-gray-100 rounded-2xl mb-4" />
                <div className="h-3 bg-gray-100 rounded w-1/3 mb-3" />
                <div className="h-5 bg-gray-100 rounded mb-2" />
                <div className="h-5 bg-gray-100 rounded w-4/5 mb-4" />
                <div className="h-3 bg-gray-100 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20 text-text-secondary">
            <p className="text-lg font-medium mb-2">No articles published yet</p>
            <p className="text-sm">Check back soon for sleep tips and lifestyle guides.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {articles.map((article, idx) => (
              <article key={article._id} className="group flex flex-col">
                <Link
                  href={`/articles/${article.slug}`}
                  className="block relative aspect-[4/3] rounded-2xl overflow-hidden mb-4 md:mb-5 bg-gray-100"
                >
                  <img
                    src={getImage(article, idx)}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {(article.tags ?? []).length > 0 && (
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur text-xs font-semibold px-2.5 py-1 rounded-full text-primary flex items-center gap-1">
                      <Tag size={10} />
                      {article.tags![0]}
                    </span>
                  )}
                </Link>

                <div className="flex-1 flex flex-col">
                  <div className="flex items-center gap-2 text-xs text-text-secondary mb-2">
                    <Calendar size={12} />
                    <span>{formatDate(article)}</span>
                    <span className="text-gray-300">•</span>
                    <span>{getAuthorName(article)}</span>
                  </div>

                  <Link href={`/articles/${article.slug}`}>
                    <h2 className="font-playfair text-lg md:text-2xl font-bold text-text-primary mb-2 md:mb-3 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                      {article.title}
                    </h2>
                  </Link>

                  {article.excerpt && (
                    <p className="text-sm text-text-secondary mb-4 line-clamp-3 flex-1">
                      {article.excerpt}
                    </p>
                  )}

                  <Link
                    href={`/articles/${article.slug}`}
                    className="mt-auto text-sm text-primary font-semibold hover:underline"
                  >
                    Read Full Article →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
