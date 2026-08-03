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
    <section className="py-16 bg-gray-50">
      <div className="container">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-playfair font-bold text-primary mb-2">Sleep Tips & Lifestyle</h2>
            <p className="text-text-secondary">Read our latest articles for a better night&apos;s rest.</p>
          </div>
          <Link href="/articles" className="hidden sm:inline-block text-primary font-medium hover:underline">
            View All Articles
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur text-xs font-semibold px-2 py-1 rounded text-primary">
                      {article.category || article.tag || 'Sleep Health'}
                    </span>
                  </Link>
                  <div className="p-5">
                    <p className="text-xs text-text-secondary mb-2">{displayDate}</p>
                    <Link href={`/articles/${article.slug}`}>
                      <h3 className="font-playfair text-xl font-bold text-primary mb-3 leading-tight group-hover:text-primary-light transition-colors">
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

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/articles"
            className="inline-block border border-border px-6 py-3 rounded-md font-medium text-text-primary hover:bg-gray-50"
          >
            View All Articles
          </Link>
        </div>
      </div>
    </section>
  );
};
