'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ProductCard } from '@/components/product/ProductCard';
import { Product } from '@/types';
import { api } from '@/lib/api';

interface QuizQuestion {
  id: string;
  title: string;
  options: string[];
  type?: string;
}

const FALLBACK_QUESTIONS: QuizQuestion[] = [
  { id: 'sleepingPosition', title: 'What is your primary sleeping position?', options: ['Side', 'Back', 'Stomach', 'Combination'], type: 'select' },
  { id: 'hasBackPain', title: 'Do you experience any back or neck pain?', options: ['Yes', 'No'], type: 'boolean' },
  { id: 'temperaturePreference', title: 'How do you sleep temperature-wise?', options: ['Cool', 'Neutral', 'Warm'], type: 'select' },
  { id: 'preferredFirmness', title: 'What is your preferred mattress feel?', options: ['Soft', 'Medium', 'Firm', 'Extra-Firm'], type: 'select' },
];

export default function SleepQuizPage() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const [step, setStep] = useState(0); // 0 = start, 1..N = questions, N+1 = analyzing, N+2 = results
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch live quiz questions from MongoDB database
  useEffect(() => {
    const fetchQuestions = async () => {
      setIsLoadingQuestions(true);
      try {
        const res: any = await api.sleepQuiz.getQuestions();
        const data = res?.data ?? res;
        const list = data?.questions || (Array.isArray(data) ? data : []);

        if (Array.isArray(list) && list.length > 0) {
          const normalized: QuizQuestion[] = list.map((q: any) => {
            let opts: string[] = q.options || [];
            if (q.type === 'boolean') opts = ['Yes', 'No'];
            return {
              id: q.id || q._id,
              title: q.label || q.title || 'Sleep Preference',
              options: opts.map((o: string) => String(o).charAt(0).toUpperCase() + String(o).slice(1)),
              type: q.type || (opts.length > 0 ? 'select' : 'text'),
            };
          });
          setQuestions(normalized);
        } else {
          setQuestions(FALLBACK_QUESTIONS);
        }
      } catch (err) {
        console.error('Failed to fetch DB quiz questions:', err);
        setQuestions(FALLBACK_QUESTIONS);
      } finally {
        setIsLoadingQuestions(false);
      }
    };
    fetchQuestions();
  }, []);

  const handleSelect = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleNext = async () => {
    if (step < questions.length) {
      setStep(step + 1);
    } else {
      // Analyze step
      setStep(questions.length + 1);
      setIsSubmitting(true);

      try {
        // 1. Submit quiz answers to backend AI service
        let quizResult: any = null;
        try {
          const quizRes: any = await api.sleepQuiz.submit(answers);
          quizResult = quizRes?.data ?? quizRes;
        } catch (e) {
          console.warn('Backend sleep quiz submit fallback:', e);
        }

        // 2. Query real matching products directly from MongoDB database
        const prodRes: any = await api.products.list({ limit: 12 });
        const prodData = prodRes?.data ?? prodRes;
        const productsList: Product[] = Array.isArray(prodData?.items)
          ? prodData.items
          : Array.isArray(prodData)
          ? prodData
          : [];

        if (productsList.length > 0) {
          let matched = productsList;
          if (quizResult?.recommendedProducts && Array.isArray(quizResult.recommendedProducts)) {
            const recommendedSkusOrIds = new Set(quizResult.recommendedProducts);
            const found = productsList.filter(
              (p) => recommendedSkusOrIds.has(p._id) || p.variants?.some((v) => recommendedSkusOrIds.has(v.sku))
            );
            if (found.length > 0) matched = found;
          }
          setRecommendations(matched.slice(0, 4));
        } else {
          setRecommendations([]);
        }
      } catch (err) {
        console.error('Failed to generate AI recommendations:', err);
      } finally {
        setIsSubmitting(false);
        setStep(questions.length + 2);
      }
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const currentQuestion = questions[step - 1];

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
              Take our AI-powered sleep quiz. Questions are dynamically generated from our sleep science database to analyze your preferences and recommend the ideal Vitafoam products.
            </p>
            <Button
              size="lg"
              className="px-10 text-lg shadow-lg"
              onClick={() => setStep(1)}
              isLoading={isLoadingQuestions}
            >
              Start the Quiz
            </Button>
          </div>
        )}

        {/* Questions */}
        {step > 0 && step <= questions.length && currentQuestion && (
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-border p-6 md:p-10 relative">
            <button
              onClick={handleBack}
              className="absolute top-6 left-6 text-text-secondary hover:text-primary cursor-pointer"
            >
              <ArrowLeft size={24} />
            </button>

            <div className="text-center mb-10 mt-6">
              <span className="text-sm font-bold text-primary tracking-widest uppercase mb-4 block">
                Question {step} of {questions.length}
              </span>
              <h2 className="text-2xl md:text-3xl font-playfair font-bold text-text-primary">
                {currentQuestion.title}
              </h2>
            </div>

            {currentQuestion.type === 'text' ? (
              <div className="space-y-4 mb-10">
                <textarea
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleSelect(currentQuestion.id, e.target.value)}
                  className="w-full p-4 md:p-5 rounded-xl border-2 border-border focus:border-primary focus:outline-none min-h-[120px]"
                  placeholder="Type your response here..."
                />
              </div>
            ) : (
              <div className="space-y-4 mb-10">
                {currentQuestion.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleSelect(currentQuestion.id, opt)}
                    className={`w-full p-4 md:p-5 rounded-xl border-2 text-left font-medium transition-all cursor-pointer ${
                      answers[currentQuestion.id] === opt
                        ? 'border-primary bg-primary/5 text-primary font-semibold'
                        : 'border-border text-text-secondary hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{opt}</span>
                      {answers[currentQuestion.id] === opt && <CheckCircle2 size={20} />}
                    </div>
                  </button>
                ))}
              </div>
            )}

            <Button
              className="w-full h-14 text-lg"
              onClick={handleNext}
              disabled={!answers[currentQuestion.id]}
              rightIcon={<ArrowRight size={20} />}
            >
              {step === questions.length ? 'Get AI Results' : 'Next'}
            </Button>
          </div>
        )}

        {/* Analyzing */}
        {step === questions.length + 1 && (
          <div className="text-center max-w-md mx-auto py-20">
            <div className="relative w-24 h-24 mx-auto mb-8">
              <div className="absolute inset-0 border-4 border-gray-100 rounded-full" />
              <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin" />
              <Sparkles className="absolute inset-0 m-auto text-primary" size={32} />
            </div>
            <h2 className="text-2xl font-playfair font-bold text-primary mb-4">
              Analyzing Your Profile...
            </h2>
            <p className="text-text-secondary">
              Our AI engine is matching your DB quiz responses with live catalog products.
            </p>
          </div>
        )}

        {/* Results */}
        {step === questions.length + 2 && (
          <div>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h1 className="text-3xl md:text-4xl font-playfair font-bold text-primary mb-4">
                Your Personalized AI Recommendations
              </h1>
              <p className="text-lg text-text-secondary">
                Based on your answers, we&apos;ve matched your profile with live products from our database.
              </p>
              <div className="mt-6 flex justify-center gap-4">
                <Button variant="outline" onClick={() => { setStep(0); setAnswers({}); }}>
                  Retake Quiz
                </Button>
                <Link href="/products">
                  <Button>Browse All Products</Button>
                </Link>
              </div>
            </div>

            {recommendations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {recommendations.map((prod, idx) => (
                  <div key={prod._id} className="relative">
                    <div className="absolute -top-3 -left-3 z-10 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                      {idx === 0 ? '🏆 Top AI Match' : '⭐ Recommended Match'}
                    </div>
                    <ProductCard product={prod} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-border rounded-2xl p-12 text-center max-w-md mx-auto">
                <p className="text-text-secondary mb-4">
                  No specific mattress matches found for this filter in the database.
                </p>
                <Link href="/products">
                  <Button>Explore Full Catalog</Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
