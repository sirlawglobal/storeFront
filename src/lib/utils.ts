import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind classes safely (even though we're mostly using vanilla CSS, 
 * this is handy for utility classes if added later, or conditional class joining).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number as Nigerian Naira (NGN)
 */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Generate or retrieve the guest session ID for unauthenticated cart tracking
 */
export function getGuestId(): string {
  if (typeof window === 'undefined') return '';
  let guestId = localStorage.getItem('vita_guest_id');
  if (!guestId) {
    guestId = 'guest_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('vita_guest_id', guestId);
  }
  return guestId;
}
