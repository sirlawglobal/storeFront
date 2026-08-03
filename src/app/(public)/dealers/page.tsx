'use client';
import React, { useEffect, useState } from 'react';
import { Search, MapPin, Phone, ExternalLink, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';

interface DealerItem {
  _id: string;
  name: string;
  address: string;
  phone?: string;
  type?: string;
  city?: string;
  state?: string;
  openingHours?: string;
  location?: {
    coordinates: [number, number]; // [lng, lat]
  };
}

const FALLBACK_DEALERS: DealerItem[] = [
  {
    _id: '1',
    name: 'Vitafoam Comfort Center - Ikeja',
    address: '131 Awolowo Way, Ikeja, Lagos',
    phone: '+234 800 000 0001',
    type: 'Flagship Store',
  },
  {
    _id: '2',
    name: 'Sleep Gallery VI',
    address: 'Plot 4, Adetokunbo Ademola Street, Victoria Island, Lagos',
    phone: '+234 800 000 0002',
    type: 'Authorized Dealer',
  },
  {
    _id: '3',
    name: 'Vitafoam Depot Surulere',
    address: '84 Adeniran Ogunsanya St, Surulere, Lagos',
    phone: '+234 800 000 0003',
    type: 'Depot',
  },
];

export default function DealersPage() {
  const [dealers, setDealers] = useState<DealerItem[]>(FALLBACK_DEALERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [locationStatus, setLocationStatus] = useState('');

  const fetchDealersByLocation = async (lat: number, lng: number) => {
    setIsLoading(true);
    setLocationStatus('Searching nearby dealers...');
    try {
      const res: any = await api.dealers.getNearby(lat, lng, 50);
      const list = res?.data ?? res;
      if (Array.isArray(list) && list.length > 0) {
        setDealers(list);
        setLocationStatus('Showing dealers near your location');
      } else {
        setLocationStatus('No nearby dealers found in 50km radius');
      }
    } catch (err) {
      console.error('Failed to fetch nearby dealers', err);
      setLocationStatus('Failed to locate nearby dealers');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setLocationStatus('Getting your location...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        fetchDealersByLocation(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {
        console.error(err);
        setLocationStatus('Location access denied or unavailable');
      }
    );
  };

  const filteredDealers = dealers.filter(
    (d) =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-playfair font-bold text-primary mb-4">
            Find a Dealer Near You
          </h1>
          <p className="text-lg text-text-secondary">
            Experience Vitafoam comfort in person at any of our authorized centers.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-border p-6 md:p-8 flex flex-col md:flex-row gap-8">
          {/* List Section */}
          <div className="w-full md:w-1/2 flex flex-col h-[600px]">
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search by city, area or store name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            </div>

            {locationStatus && (
              <p className="text-xs text-primary font-medium mb-4 flex items-center gap-1">
                <Navigation size={12} /> {locationStatus}
              </p>
            )}

            <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-32 bg-gray-100 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : (
                filteredDealers.map((dealer) => (
                  <div
                    key={dealer._id}
                    className="border border-border rounded-xl p-5 hover:border-primary transition-colors cursor-pointer group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-text-primary group-hover:text-primary transition-colors">
                        {dealer.name}
                      </h3>
                      {dealer.type && (
                        <span className="text-xs font-semibold bg-gray-100 text-text-secondary px-2 py-1 rounded">
                          {dealer.type}
                        </span>
                      )}
                    </div>
                    <div className="flex items-start gap-2 text-text-secondary text-sm mb-2">
                      <MapPin size={16} className="shrink-0 mt-0.5 text-primary" />
                      <span>{dealer.address}</span>
                    </div>
                    {dealer.phone && (
                      <div className="flex items-center gap-2 text-text-secondary text-sm">
                        <Phone size={16} className="shrink-0 text-primary" />
                        <span>{dealer.phone}</span>
                      </div>
                    )}
                    <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
                      <span className="text-sm font-medium text-success">
                        {dealer.openingHours || 'Open Today: 9am - 6pm'}
                      </span>
                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(dealer.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary text-sm font-semibold flex items-center gap-1 hover:underline"
                      >
                        Get Directions <ExternalLink size={14} />
                      </a>
                    </div>
                  </div>
                ))
              )}

              {!isLoading && filteredDealers.length === 0 && (
                <div className="text-center py-10 text-text-secondary">
                  <p>No dealers found matching &quot;{searchTerm}&quot;</p>
                </div>
              )}
            </div>
          </div>

          {/* Map Section */}
          <div className="w-full md:w-1/2 bg-gray-200 rounded-xl flex items-center justify-center relative overflow-hidden h-[400px] md:h-auto border border-border">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=80')] opacity-50 bg-cover bg-center grayscale" />
            <div className="relative z-10 bg-white/90 backdrop-blur p-6 rounded-xl text-center shadow-lg max-w-[80%]">
              <MapPin size={40} className="mx-auto text-primary mb-3" />
              <h3 className="font-bold text-lg mb-2">Find Nearby Stores</h3>
              <p className="text-sm text-text-secondary mb-4">
                Use your device GPS to locate the nearest Vitafoam experience center automatically.
              </p>
              <Button size="sm" onClick={handleUseLocation} isLoading={isLoading}>
                Use My Location
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
