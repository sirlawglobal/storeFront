'use client';
import React, { useState } from 'react';
import { Star, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { api } from '@/lib/api';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
  productImage?: string;
  onSuccess?: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  productId,
  productName,
  productImage,
  onSuccess,
}) => {
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccessMsg('');

    try {
      await api.reviews.submit(productId, {
        rating,
        title: title.trim() || 'Verified Purchase Review',
        body: comment,
      } as any);
      setSuccessMsg('Thank you! Your verified purchase review has been submitted for moderation.');
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err?.error?.message || err?.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative border border-border">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>

        <h3 className="text-xl font-playfair font-bold text-primary mb-1">Review Delivered Item</h3>
        <p className="text-xs text-text-secondary mb-4">Share your feedback for your verified purchase</p>

        {/* Product Card */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-5 border border-border">
          {productImage ? (
            <img src={productImage} alt={productName} className="w-12 h-12 rounded-lg object-cover border border-border" />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
              Item
            </div>
          )}
          <div>
            <p className="font-semibold text-sm text-text-primary line-clamp-1">{productName}</p>
            <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
              Verified Order Delivered
            </span>
          </div>
        </div>

        {successMsg ? (
          <div className="bg-green-50 text-green-800 p-4 rounded-xl text-center text-sm font-medium">
            {successMsg}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            {error && <div className="bg-red-50 text-red-700 p-3 rounded-lg text-xs">{error}</div>}

            {/* Rating Stars */}
            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1.5">Rating</label>
              <div className="flex gap-1 text-accent">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-110 transition-transform focus:outline-none"
                  >
                    <Star size={26} className={star <= rating ? 'fill-current text-amber-400' : 'text-gray-300'} />
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1">Headline / Summary (Optional)</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Extremely comfortable mattress, improved my sleep!"
                className="w-full px-3 py-2 rounded-lg border border-border text-xs focus:border-primary focus:outline-none"
              />
            </div>

            {/* Comment */}
            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1">Your Detailed Review</label>
              <textarea
                required
                maxLength={1000}
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tell other shoppers about the quality, comfort, and performance of this item..."
                className="w-full px-3 py-2 rounded-lg border border-border text-xs focus:border-primary focus:outline-none resize-none"
              />
            </div>

            <div className="pt-3 flex items-center justify-end gap-3 border-t border-border">
              <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" size="sm" isLoading={isSubmitting}>
                Submit Verified Review
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
