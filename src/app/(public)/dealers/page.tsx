'use client';
import React, { useState } from 'react';
import { Search, MapPin, Phone, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/Button';

// Mock Dealer Data
const MOCK_DEALERS = [
  { id: '1', name: 'Vitafoam Comfort Center - Ikeja', address: '131 Awolowo Way, Ikeja, Lagos', phone: '+234 800 000 0001', type: 'Flagship Store' },
  { id: '2', name: 'Sleep Gallery VI', address: 'Plot 4, Adetokunbo Ademola Street, Victoria Island, Lagos', phone: '+234 800 000 0002', type: 'Authorized Dealer' },
  { id: '3', name: 'Vitafoam Depot Surulere', address: '84 Adeniran Ogunsanya St, Surulere, Lagos', phone: '+234 800 000 0003', type: 'Depot' },
];

export default function DealersPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDealers = MOCK_DEALERS.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-playfair font-bold text-primary mb-4">Find a Dealer Near You</h1>
          <p className="text-lg text-text-secondary">Experience Vitafoam comfort in person at any of our authorized centers.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-border p-6 md:p-8 flex flex-col md:flex-row gap-8">
          
          {/* List Section */}
          <div className="w-full md:w-1/2 flex flex-col h-[600px]">
            <div className="relative mb-6">
              <input 
                type="text" 
                placeholder="Search by city, area or store name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
              {filteredDealers.map(dealer => (
                <div key={dealer.id} className="border border-border rounded-xl p-5 hover:border-primary transition-colors cursor-pointer group">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-text-primary group-hover:text-primary transition-colors">{dealer.name}</h3>
                    <span className="text-xs font-semibold bg-gray-100 text-text-secondary px-2 py-1 rounded">
                      {dealer.type}
                    </span>
                  </div>
                  <div className="flex items-start gap-2 text-text-secondary text-sm mb-2">
                    <MapPin size={16} className="shrink-0 mt-0.5 text-primary" />
                    <span>{dealer.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-text-secondary text-sm">
                    <Phone size={16} className="shrink-0 text-primary" />
                    <span>{dealer.phone}</span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
                    <span className="text-sm font-medium text-success">Open Today: 9am - 6pm</span>
                    <button className="text-primary text-sm font-semibold flex items-center gap-1 hover:underline">
                      Get Directions <ExternalLink size={14} />
                    </button>
                  </div>
                </div>
              ))}
              
              {filteredDealers.length === 0 && (
                <div className="text-center py-10 text-text-secondary">
                  <p>No dealers found matching "{searchTerm}"</p>
                </div>
              )}
            </div>
          </div>

          {/* Map Section (Mock) */}
          <div className="w-full md:w-1/2 bg-gray-200 rounded-xl flex items-center justify-center relative overflow-hidden h-[400px] md:h-auto border border-border">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=80')] opacity-50 bg-cover bg-center grayscale" />
            <div className="relative z-10 bg-white/90 backdrop-blur p-6 rounded-xl text-center shadow-lg max-w-[80%]">
              <MapPin size={40} className="mx-auto text-primary mb-3" />
              <h3 className="font-bold text-lg mb-2">Interactive Map</h3>
              <p className="text-sm text-text-secondary mb-4">Map integration would be implemented here using Google Maps API or Mapbox.</p>
              <Button size="sm">Use My Location</Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
