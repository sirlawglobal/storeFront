'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Calendar, User, Tag, Share2 } from 'lucide-react';
import { api } from '@/lib/api';

interface Article {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  coverImage?: string;
  featuredImage?: string;
  tags?: string[];
  authorId?: { firstName?: string; lastName?: string } | string;
  publishedAt?: string;
  createdAt?: string;
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=1200&q=80';

export default function ArticleDetailPage() {
  const { slug } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      setIsLoading(true);
      setNotFound(false);
      try {
        const res: any = await api.articles.getBySlug(slug as string);
        const data = res?.data?.data ?? res?.data ?? res;
        if (data && (data._id || data.id)) {
          setArticle(data);
        } else {
          setNotFound(true);
        }
      } catch (err: any) {
        console.error('Failed to load article:', err);
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };
    if (slug) fetchArticle();
  }, [slug]);

  const getAuthorName = () => {
    if (!article?.authorId) return 'Vitafoam Editorial';
    if (typeof article.authorId === 'string') return 'Vitafoam Editorial';
    const a = article.authorId as { firstName?: string; lastName?: string };
    return [a.firstName, a.lastName].filter(Boolean).join(' ') || 'Vitafoam Editorial';
  };

  const formatDate = () => {
    const dateStr = article?.publishedAt || article?.createdAt;
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-NG', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: article?.title, url: window.location.href });
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white min-h-screen pb-16 animate-pulse">
        <div className="w-full h-[40vh] md:h-[55vh] bg-gray-200" />
        <div className="container max-w-3xl mx-auto mt-10 px-4 space-y-4">
          <div className="h-4 bg-gray-100 rounded w-24" />
          <div className="h-6 bg-gray-100 rounded w-3/4" />
          <div className="h-6 bg-gray-100 rounded w-1/2" />
          <div className="h-4 bg-gray-100 rounded" />
          <div className="h-4 bg-gray-100 rounded" />
          <div className="h-4 bg-gray-100 rounded w-5/6" />
        </div>
      </div>
    );
  }

  if (notFound || !article) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-2xl font-playfair font-bold text-primary mb-3">Article Not Found</h1>
        <p className="text-text-secondary mb-6">This article may have been removed or the link is incorrect.</p>
        <Link href="/articles" className="text-primary font-medium hover:underline flex items-center gap-2">
          <ArrowLeft size={16} /> Back to all articles
        </Link>
      </div>
    );
  }

  const coverImg = article.coverImage || article.featuredImage || FALLBACK_IMAGE;

  return (
    <div className="bg-white min-h-screen pb-16">
      {/* Hero Image */}
      <div className="w-full h-[40vh] md:h-[55vh] relative">
        <img
          src={coverImg}
          alt={article.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="container max-w-4xl mx-auto">
            {(article.tags ?? []).length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3 md:mb-4">
                {article.tags!.map((tag) => (
                  <span
                    key={tag}
                    className="bg-primary text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1"
                  >
                    <Tag size={10} /> {tag}
                  </span>
                ))}
              </div>
            )}
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-playfair font-bold text-white leading-tight mb-4">
              {article.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-white/80 text-xs md:text-sm font-medium">
              <div className="flex items-center gap-1.5">
                <User size={14} />
                <span>{getAuthorName()}</span>
              </div>
              {formatDate() && (
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  <span>{formatDate()}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-3xl mx-auto mt-8 md:mt-12 px-4">
        <Link
          href="/articles"
          className="inline-flex items-center gap-2 text-text-secondary hover:text-primary font-medium mb-8 transition-colors text-sm"
        >
          <ArrowLeft size={18} />
          Back to all articles
        </Link>

        {/* Excerpt / Lead */}
        {article.excerpt && (
          <p className="text-lg md:text-xl text-text-primary font-playfair italic mb-8 border-l-4 border-primary pl-5 leading-relaxed">
            {article.excerpt}
          </p>
        )}

        {/* Main Content */}
        <article className="prose prose-base md:prose-lg max-w-none text-text-secondary">
          {article.content ? (
            // If content is HTML from a rich-text editor
            article.content.trim().startsWith('<')
              ? <div dangerouslySetInnerHTML={{ __html: article.content }} />
              : <p className="whitespace-pre-wrap">{article.content}</p>
          ) : (
            <p className="text-text-secondary italic">No content available for this article.</p>
          )}
        </article>

        {/* Share Footer */}
        <div className="mt-12 pt-8 border-t border-border flex items-center justify-between">
          <div>
            <p className="font-semibold text-text-primary text-sm mb-1">Share this article</p>
            <p className="text-xs text-text-secondary">Help others sleep better tonight!</p>
          </div>
          <button
            onClick={handleShare}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-text-secondary hover:bg-primary hover:text-white transition-colors"
            title="Share article"
          >
            <Share2 size={18} />
          </button>
        </div>

        {/* Back link */}
        <div className="mt-8 text-center">
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
          >
            <ArrowLeft size={16} /> View All Articles
          </Link>
        </div>
      </div>
    </div>
  );
}
