'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';

interface ArticleItem {
  _id: string;
  title: string;
  slug: string;
  featuredImage?: string;
  image?: string;
  category?: string;
  tag?: string;
  createdAt?: string;
}

export const BlogPreview = () => {
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      try {
        const res: any = await api.articles.list({ limit: 3 });
        const list = res?.data?.items ?? res?.items ?? res?.data ?? res;
        if (Array.isArray(list) && list.length > 0) {
          setArticles(list);
        }
      } catch (err) {
        console.error('Failed to load blog articles:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchArticles();
  }, []);

  if (!isLoading && articles.length === 0) {
    return null; // Don't show blog section if no articles exist
  }

  return (
    <section className="py-10 md:py-16 bg-gray-50">
      <div className="container px-4 md:px-6">
        <div className="flex justify-between items-end mb-6 md:mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-playfair font-bold text-primary mb-1 md:mb-2">Sleep Tips &amp; Lifestyle</h2>
            <p className="text-sm md:text-base text-text-secondary">Read our latest articles for a better night&apos;s rest.</p>
          </div>
          <Link href="/articles" className="hidden sm:inline-block text-primary font-medium hover:underline text-sm ml-4 shrink-0">
            View All Articles
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-52 md:h-64 bg-gray-200 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
            {articles.map((article) => {
              const bgImg =
                article.featuredImage ||
                article.image ||
                'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=500&q=80';
              const displayDate = article.createdAt
                ? new Date(article.createdAt).toLocaleDateString('en-NG', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })
                : 'Sleep Health';

              return (
                <article
                  key={article._id}
                  className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <Link href={`/articles/${article.slug}`} className="block relative aspect-video overflow-hidden">
                    <img
                      src={bgImg}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute top-2 left-2 bg-white/90 backdrop-blur text-xs font-semibold px-2 py-0.5 rounded text-primary">
                      {article.category || article.tag || 'Sleep Health'}
                    </span>
                  </Link>
                  <div className="p-4 md:p-5">
                    <p className="text-xs text-text-secondary mb-1 md:mb-2">{displayDate}</p>
                    <Link href={`/articles/${article.slug}`}>
                      <h3 className="font-playfair text-base md:text-xl font-bold text-primary mb-2 md:mb-3 leading-tight group-hover:text-primary-light transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                    </Link>
                    <Link
                      href={`/articles/${article.slug}`}
                      className="text-sm font-semibold text-accent hover:underline"
                    >
                      Read Article →
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <div className="mt-6 text-center sm:hidden">
          <Link
            href="/articles"
            className="inline-block border border-border px-6 py-3 rounded-md font-medium text-text-primary hover:bg-gray-50 text-sm"
          >
            View All Articles
          </Link>
        </div>
      </div>
    </section>
  );
};
