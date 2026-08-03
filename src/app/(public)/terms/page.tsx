import React from 'react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container max-w-3xl">
        <h1 className="font-playfair text-4xl font-bold text-primary mb-6">Terms &amp; Conditions</h1>
        <p className="text-text-secondary text-lg leading-relaxed mb-4">
          By accessing and using the Vitafoam online store, you agree to be bound by these Terms and Conditions.
        </p>
        <h2 className="font-playfair text-2xl font-semibold text-primary mt-8 mb-3">Orders &amp; Payments</h2>
        <p className="text-text-secondary leading-relaxed mb-4">
          All orders are subject to product availability. Payment is required at the time of purchase.
          We accept major debit/credit cards and bank transfers.
        </p>
        <h2 className="font-playfair text-2xl font-semibold text-primary mt-8 mb-3">Returns &amp; Refunds</h2>
        <p className="text-text-secondary leading-relaxed mb-4">
          Products may be returned within 7 days of delivery in their original condition. Please contact our
          support team to initiate a return.
        </p>
        <h2 className="font-playfair text-2xl font-semibold text-primary mt-8 mb-3">Contact</h2>
        <p className="text-text-secondary leading-relaxed">
          For any questions about these terms, please contact us at support@vitafoam.com.ng.
        </p>
      </div>
    </div>
  );
}
