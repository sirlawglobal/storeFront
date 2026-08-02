'use client';
import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Calendar, User, Share2 } from 'lucide-react';

export default function ArticleDetailPage() {
  const { slug } = useParams();
  
  // Convert slug to title format for mock display
  const title = typeof slug === 'string' 
    ? slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    : 'Article Title';

  return (
    <div className="bg-white min-h-screen pb-16">
      {/* Hero Image */}
      <div className="w-full h-[40vh] md:h-[60vh] relative">
        <img 
          src="https://images.unsplash.com/photo-1505693314120-0d443867891c?w=1200&q=80" 
          alt="Article cover" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
          <div className="container max-w-4xl mx-auto">
            <span className="bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full mb-4 inline-block">
              Sleep Health
            </span>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-playfair font-bold text-white leading-tight mb-6">
              {title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-white/80 text-sm font-medium">
              <div className="flex items-center gap-2">
                <User size={16} />
                <span>Dr. Sleep Expert</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>August 1, 2026</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-4xl mx-auto mt-12 md:mt-16 px-4">
        <Link href="/articles" className="inline-flex items-center gap-2 text-text-secondary hover:text-primary font-medium mb-10 transition-colors">
          <ArrowLeft size={20} />
          Back to all articles
        </Link>

        {/* Content */}
        <article className="prose prose-lg md:prose-xl prose-green max-w-none text-text-secondary">
          <p className="lead text-xl md:text-2xl text-text-primary font-playfair italic mb-10">
            A good night's sleep is the foundation of a healthy, productive life. But when your mattress is causing back pain, that foundation crumbles. Here is how to find the perfect support.
          </p>

          <h2>Understanding Spinal Alignment</h2>
          <p>
            When you lie down, your spine should maintain its natural curve. If a mattress is too soft, your hips and shoulders sink too deeply, throwing your spine out of alignment. If it's too firm, it pushes against your pressure points and leaves your lower back unsupported.
          </p>

          <img 
            src="https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80" 
            alt="Person sleeping comfortably" 
            className="rounded-2xl my-10 w-full"
          />

          <h2>Firmness Isn't One Size Fits All</h2>
          <p>
            The ideal firmness depends heavily on your primary sleep position:
          </p>
          <ul>
            <li><strong>Side Sleepers:</strong> Generally need a medium-soft to medium mattress to cushion the shoulders and hips.</li>
            <li><strong>Back Sleepers:</strong> Typically fare best on medium-firm mattresses that support the lower back curve.</li>
            <li><strong>Stomach Sleepers:</strong> Require firm mattresses to prevent the hips from sinking, which strains the lower back.</li>
          </ul>

          <h2>Material Matters</h2>
          <p>
            Memory foam and latex offer excellent contouring and pressure relief, making them popular choices for back pain sufferers. Innerspring mattresses with individually wrapped coils (pocketed coils) can also provide targeted support while reducing motion transfer.
          </p>
          
          <div className="bg-primary/5 border-l-4 border-primary p-6 my-10 rounded-r-xl">
            <h4 className="font-playfair text-xl font-bold text-primary m-0 mb-2">Pro Tip</h4>
            <p className="m-0 text-base">Don't forget your pillow! Even the best mattress can't fix back pain if your neck isn't supported properly. Ensure your pillow keeps your neck in a neutral position aligned with your spine.</p>
          </div>
        </article>

        <div className="mt-16 pt-8 border-t border-border flex justify-between items-center">
          <p className="font-medium">Share this article</p>
          <div className="flex gap-4">
            <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-text-secondary hover:bg-primary hover:text-white transition-colors">
              <Share2 size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
