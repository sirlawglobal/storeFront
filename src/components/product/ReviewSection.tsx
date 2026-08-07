'use client';
import React, { useEffect, useState } from 'react';
import { Star, User, ThumbsUp } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuthStore } from '@/store/auth.store';
import { api } from '@/lib/api';

interface ReviewItem {
  _id: string;
  userName?: string;
  userFirstName?: string;
  userLastName?: string;
  rating: number;
  title?: string;
  comment?: string;
  content?: string;
  helpfulCount?: number;
  createdAt?: string;
}

interface ReviewSectionProps {
  productId: string;
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({ productId }) => {
  const { isLoggedIn } = useAuthStore();
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const res: any = await api.reviews.getByProduct(productId);
      const list = res?.data?.items ?? res?.data ?? res;
      setReviews(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (productId) fetchReviews();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setMessage('');
    try {
      await api.reviews.submit(productId, { rating, title, comment });
      setMessage('Thank you! Your review has been submitted for moderation.');
      setShowForm(false);
      setTitle('');
      setComment('');
      fetchReviews();
    } catch (err: any) {
      setError(err.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleHelpful = async (id: string) => {
    try {
      await api.reviews.markHelpful(id);
      setReviews((prev) =>
        prev.map((r) => (r._id === id ? { ...r, helpfulCount: (r.helpfulCount || 0) + 1 } : r))
      );
    } catch (err: any) {
      console.error('Failed to mark review helpful', err);
    }
  };

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviews.length).toFixed(1)
      : '0.0';

  return (
    <div className="mt-12 pt-12 border-t border-border">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-playfair font-bold text-primary mb-2">Customer Reviews</h2>
          <div className="flex items-center gap-2">
            <div className="flex text-accent">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  size={18}
                  className={i <= Math.round(Number(avgRating)) ? 'fill-current' : 'text-gray-300'}
                />
              ))}
            </div>
            <span className="font-semibold">{avgRating} out of 5</span>
            <span className="text-text-secondary text-sm">
              ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
            </span>
          </div>
        </div>

        {isLoggedIn ? (
          <div className="flex items-center gap-3">
            <a
              href="/account/orders"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-primary text-primary text-xs font-semibold hover:bg-primary hover:text-white transition-colors"
            >
              Review Delivered Orders →
            </a>
          </div>
        ) : (
          <p className="text-xs text-text-secondary border border-border p-3 rounded-xl bg-gray-50">
            Purchased this item?{' '}
            <a href="/login" className="text-primary font-semibold hover:underline">
              Sign in
            </a>{' '}
            and write a review from your <strong className="text-text-primary">Order History</strong> once delivered!
          </p>
        )}
      </div>

      {message && (
        <div className="bg-green-50 text-success text-sm p-3 rounded-md mb-6">{message}</div>
      )}
      {error && (
        <div className="bg-red-50 text-error text-sm p-3 rounded-md mb-6">{error}</div>
      )}

      {/* Review Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gray-50 rounded-xl space-y-4 border border-border">
          <h3 className="font-bold text-lg text-primary">Write Your Review</h3>

          <div>
            <label className="block text-sm font-medium mb-1">Rating</label>
            <div className="flex gap-1 text-accent">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star size={24} className={star <= rating ? 'fill-current' : 'text-gray-300'} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Title (optional)</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-base"
              placeholder="Summarize your experience"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Review</label>
            <textarea
              required
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="input-base resize-none"
              placeholder="Tell others what you think about this product..."
            />
          </div>

          <Button type="submit" isLoading={isSubmitting}>
            Submit Review
          </Button>
        </form>
      )}

      {/* Reviews List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-28 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-8 text-text-secondary">
          <p>No reviews yet for this product. Be the first to write one!</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {reviews.map((review) => (
            <div key={review._id} className="bg-gray-50 p-6 rounded-xl">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary shadow-sm">
                    <User size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-text-primary">
                      {review.userName ||
                        `${review.userFirstName || 'Customer'} ${review.userLastName || ''}`}
                    </p>
                    <p className="text-xs text-text-secondary">
                      {review.createdAt
                        ? new Date(review.createdAt).toLocaleDateString('en-NG', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })
                        : 'Verified Buyer'}
                    </p>
                  </div>
                </div>
                <div className="flex text-accent">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < review.rating ? 'fill-current' : 'text-gray-300'}
                    />
                  ))}
                </div>
              </div>
              {review.title && <h4 className="font-semibold mb-2">{review.title}</h4>}
              <p className="text-text-secondary text-sm leading-relaxed mb-4">
                {review.comment || review.content}
              </p>
              <button
                onClick={() => handleHelpful(review._id)}
                className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-primary transition-colors"
              >
                <ThumbsUp size={14} /> Helpful ({review.helpfulCount || 0})
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
