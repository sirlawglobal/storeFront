'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ProductCard } from '@/components/product/ProductCard';
import { Product } from '@/types';

const QUESTIONS = [
  { id: 'q1', title: 'What is your primary sleeping position?', options: ['Side', 'Back', 'Stomach', 'Combination'] },
  { id: 'q2', title: 'Do you experience any back or neck pain?', options: ['Often', 'Sometimes', 'Rarely', 'Never'] },
  { id: 'q3', title: 'Do you tend to sleep hot or cold?', options: ['Very Hot (I sweat often)', 'Warm', 'Neutral', 'Cold'] },
  { id: 'q4', title: 'What is your preferred mattress feel?', options: ['Plush (Soft)', 'Medium', 'Firm', 'Extra Firm'] },
];

export default function SleepQuizPage() {
  const [step, setStep] = useState(0); // 0 = start, 1-4 = questions, 5 = analyzing, 6 = results
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [recommendations, setRecommendations] = useState<Partial<Product>[]>([]);

  const handleSelect = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleNext = () => {
    if (step < QUESTIONS.length) {
      setStep(step + 1);
    } else {
      // Analyze
      setStep(QUESTIONS.length + 1);
      setTimeout(() => {
        // Mock results
        setRecommendations([
          { _id: '1', slug: 'vita-ortho', name: 'Vita Ortho Mattress', price: 125000, images: ['https://images.unsplash.com/photo-1505693314120-0d443867891c?w=500&q=80'], averageRating: 4.8, reviewCount: 120, brand: 'Vitafoam' },
          { _id: '2', slug: 'memory-pillow', name: 'Memory Contour Pillow', price: 25000, images: ['https://images.unsplash.com/photo-1584100936595-c0654b35a146?w=500&q=80'], averageRating: 4.9, reviewCount: 85, brand: 'Vitafoam' }
        ]);
        setStep(QUESTIONS.length + 2);
      }, 2500);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="container max-w-4xl py-12 md:py-20">
        
        {/* Intro Step */}
        {step === 0 && (
          <div className="text-center max-w-2xl mx-auto py-12">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
              <Sparkles size={40} className="text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-playfair font-bold text-primary mb-6">
              Find Your Perfect Mattress
            </h1>
            <p className="text-lg text-text-secondary mb-10 leading-relaxed">
              Take our 2-minute AI-powered sleep quiz. We'll analyze your sleep habits and preferences to recommend the exact Vitafoam products designed for your body.
            </p>
            <Button size="lg" className="px-10 text-lg shadow-lg" onClick={() => setStep(1)}>
              Start the Quiz
            </Button>
          </div>
        )}

        {/* Questions */}
        {step > 0 && step <= QUESTIONS.length && (
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-border p-6 md:p-10 relative">
            <button onClick={handleBack} className="absolute top-6 left-6 text-text-secondary hover:text-primary">
              <ArrowLeft size={24} />
            </button>
            
            <div className="text-center mb-10 mt-6">
              <span className="text-sm font-bold text-primary tracking-widest uppercase mb-4 block">
                Question {step} of {QUESTIONS.length}
              </span>
              <h2 className="text-2xl md:text-3xl font-playfair font-bold text-text-primary">
                {QUESTIONS[step - 1].title}
              </h2>
            </div>

            <div className="space-y-4 mb-10">
              {QUESTIONS[step - 1].options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleSelect(QUESTIONS[step - 1].id, opt)}
                  className={`w-full p-4 md:p-5 rounded-xl border-2 text-left font-medium transition-all ${
                    answers[QUESTIONS[step - 1].id] === opt 
                      ? 'border-primary bg-primary/5 text-primary' 
                      : 'border-border text-text-secondary hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    {opt}
                    {answers[QUESTIONS[step - 1].id] === opt && <CheckCircle2 size={20} />}
                  </div>
                </button>
              ))}
            </div>

            <Button 
              className="w-full h-14 text-lg" 
              onClick={handleNext}
              disabled={!answers[QUESTIONS[step - 1].id]}
              rightIcon={<ArrowRight size={20} />}
            >
              {step === QUESTIONS.length ? 'Get Results' : 'Next'}
            </Button>
          </div>
        )}

        {/* Analyzing */}
        {step === QUESTIONS.length + 1 && (
          <div className="text-center max-w-md mx-auto py-20">
            <div className="relative w-24 h-24 mx-auto mb-8">
              <div className="absolute inset-0 border-4 border-gray-100 rounded-full" />
              <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin" />
              <Sparkles className="absolute inset-0 m-auto text-primary" size={32} />
            </div>
            <h2 className="text-2xl font-playfair font-bold text-primary mb-4">Analyzing Your Profile...</h2>
            <p className="text-text-secondary">Our AI is matching your preferences with our product catalog.</p>
          </div>
        )}

        {/* Results */}
        {step === QUESTIONS.length + 2 && (
          <div>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h1 className="text-3xl md:text-4xl font-playfair font-bold text-primary mb-4">
                Your Personalized Recommendations
              </h1>
              <p className="text-lg text-text-secondary">
                Based on your answers, we've found the perfect products to improve your sleep quality.
              </p>
              <div className="mt-6 flex justify-center gap-4">
                <Button variant="outline" onClick={() => setStep(0)}>Retake Quiz</Button>
                <Link href="/products">
                  <Button>Browse All Products</Button>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {recommendations.map(prod => (
                <div key={prod._id} className="relative">
                  <div className="absolute -top-3 -left-3 z-10 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    Top Match
                  </div>
                  <ProductCard product={prod as Product} />
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
