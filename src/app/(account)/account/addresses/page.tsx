'use client';
import React from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

// Mock address data
const MOCK_ADDRESSES = [
  { id: '1', label: 'Home', name: 'John Doe', address: '123 Sleepy Hollow Road', city: 'Ikeja', state: 'Lagos', phone: '+2348012345678', isDefault: true },
  { id: '2', label: 'Office', name: 'John Doe', address: '45 Business Avenue, Victoria Island', city: 'Eti-Osa', state: 'Lagos', phone: '+2348012345678', isDefault: false }
];

export default function AddressesPage() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-border p-6 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-playfair font-bold text-primary">Saved Addresses</h1>
        <Button size="sm" leftIcon={<Plus size={16} />}>
          Add New
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MOCK_ADDRESSES.map((addr) => (
          <div key={addr.id} className={`border rounded-xl p-5 ${addr.isDefault ? 'border-primary bg-primary/5' : 'border-border'}`}>
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-text-primary">{addr.label}</span>
                {addr.isDefault && (
                  <span className="bg-primary text-white text-[10px] uppercase tracking-wider px-2 py-0.5 rounded font-bold">
                    Default
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <button className="text-text-secondary hover:text-primary transition-colors p-1"><Edit2 size={16} /></button>
                {!addr.isDefault && (
                  <button className="text-text-secondary hover:text-error transition-colors p-1"><Trash2 size={16} /></button>
                )}
              </div>
            </div>
            
            <p className="font-medium text-sm mb-1">{addr.name}</p>
            <p className="text-sm text-text-secondary mb-1">{addr.address}</p>
            <p className="text-sm text-text-secondary mb-3">{addr.city}, {addr.state}</p>
            <p className="text-sm text-text-secondary">Tel: {addr.phone}</p>
            
            {!addr.isDefault && (
              <button className="mt-4 text-primary text-sm font-medium hover:underline">
                Set as default
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
