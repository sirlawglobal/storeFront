'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function SleepQuizModal() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user has already dismissed or completed the sleep quiz
    const dismissed = localStorage.getItem('vita_sleep_quiz_dismissed');
    if (dismissed === 'true') return;

    // Show modal after 10 seconds
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('vita_sleep_quiz_dismissed', 'true');
    setIsOpen(false);
  };

  const handleStartQuiz = () => {
    localStorage.setItem('vita_sleep_quiz_dismissed', 'true');
    setIsOpen(false);
    router.push('/sleep-quiz');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl border border-border max-w-lg w-full p-8 md:p-10 relative overflow-hidden text-center">
        {/* Subtle background decoration */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* Icon Header */}
        <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
          <Sparkles size={32} />
        </div>

        {/* Modal Title & Content */}
        <h2 className="text-2xl md:text-3xl font-playfair font-bold text-text-primary mb-3">
          Find Your Perfect Mattress
        </h2>

        <p className="text-text-secondary text-sm md:text-base leading-relaxed mb-8">
          Not sure which mattress fits your body type and sleep style? Take our 60-second AI-powered sleep quiz to get personalized recommendations tailored for you.
        </p>

        {/* Action CTAs */}
        <div className="space-y-3">
          <Button
            size="lg"
            className="w-full h-13 text-base shadow-md group"
            onClick={handleStartQuiz}
            rightIcon={<ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
          >
            Take 60-Second Sleep Quiz
          </Button>

          <button
            onClick={handleDismiss}
            className="w-full py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
          >
            Maybe Later, I&apos;ll Browse First
          </button>
        </div>
      </div>
    </div>
  );
}
