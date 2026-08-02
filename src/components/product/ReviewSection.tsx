import React from 'react';
import { Star, User } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuthStore } from '@/store/auth.store';

interface ReviewSectionProps {
  productId: string;
}

// Mock reviews
const MOCK_REVIEWS = [
  { id: '1', user: 'Sarah J.', rating: 5, date: '2 days ago', title: 'Life-changing comfort', content: 'I have had back pain for years, but this mattress completely changed how I sleep. It provides the perfect balance of support and softness.' },
  { id: '2', user: 'Michael K.', rating: 4, date: '1 week ago', title: 'Great quality', content: 'Very well made. Arrived on time. Takes a few days to fully expand but worth the wait.' },
];

export const ReviewSection: React.FC<ReviewSectionProps> = ({ productId }) => {
  const { isLoggedIn } = useAuthStore();

  return (
    <div className="mt-12 pt-12 border-t border-border">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-playfair font-bold text-primary mb-2">Customer Reviews</h2>
          <div className="flex items-center gap-2">
            <div className="flex text-accent">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} size={18} className={i <= 4 ? 'fill-current' : 'text-gray-300'} />
              ))}
            </div>
            <span className="font-semibold">4.5 out of 5</span>
            <span className="text-text-secondary text-sm">(Based on 120 reviews)</span>
          </div>
        </div>
        
        {isLoggedIn ? (
          <Button variant="outline">Write a Review</Button>
        ) : (
          <p className="text-sm text-text-secondary border p-3 rounded-md">
            Please <a href="/login" className="text-primary font-medium hover:underline">sign in</a> to leave a review.
          </p>
        )}
      </div>

      <div className="grid gap-6">
        {MOCK_REVIEWS.map((review) => (
          <div key={review.id} className="bg-gray-50 p-6 rounded-xl">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary shadow-sm">
                  <User size={20} />
                </div>
                <div>
                  <p className="font-semibold text-text-primary">{review.user}</p>
                  <p className="text-xs text-text-secondary">{review.date}</p>
                </div>
              </div>
              <div className="flex text-accent">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className={i < review.rating ? 'fill-current' : 'text-gray-300'} />
                ))}
              </div>
            </div>
            <h4 className="font-semibold mb-2">{review.title}</h4>
            <p className="text-text-secondary text-sm leading-relaxed">{review.content}</p>
          </div>
        ))}
      </div>
      
      <div className="mt-8 text-center">
        <Button variant="outline">Load More Reviews</Button>
      </div>
    </div>
  );
};
