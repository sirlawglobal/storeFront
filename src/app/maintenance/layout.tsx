import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Under Maintenance | Vitafoam',
  description: 'We are currently performing scheduled maintenance on our site. We will be back shortly.',
};

export default function MaintenanceLayout({ children }: { children: React.ReactNode }) {
  // Use a minimal layout without header and footer
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      {children}
    </div>
  );
}
