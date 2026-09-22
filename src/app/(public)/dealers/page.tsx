'use client';
import React, { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { Search, MapPin, Phone, ExternalLink, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';
import type { MapDealer } from '@/components/dealers/DealerMap';

// Leaflet touches `window` at import time, so the map must be client-only.
const DealerMap = dynamic(() => import('@/components/dealers/DealerMap'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-gray-100 rounded-xl">
      <p className="text-text-secondary text-sm">Loading map...</p>
    </div>
  ),
});

interface DealerItem {
  _id: string;
  name: string;
  address: string;
  contactPhone?: string;
  contactEmail?: string;
  operatingHours?: string;
  type?: string;
  location?: {
    coordinates: [number, number]; // [lng, lat]
  };
}

const LAGOS_CENTER: [number, number] = [6.5244, 3.3792];

const FALLBACK_DEALERS: DealerItem[] = [
  {
    _id: '1',
    name: 'Vitafoam Comfort Center - Ikeja',
    address: '131 Awolowo Way, Ikeja, Lagos',
    contactPhone: '+234 800 000 0001',
    type: 'Flagship Store',
    location: { coordinates: [3.3515, 6.6018] },
  },
  {
    _id: '2',
    name: 'Sleep Gallery VI',
    address: 'Plot 4, Adetokunbo Ademola Street, Victoria Island, Lagos',
    contactPhone: '+234 800 000 0002',
    type: 'Authorized Dealer',
    location: { coordinates: [3.4239, 6.4281] },
  },
  {
    _id: '3',
    name: 'Vitafoam Depot Surulere',
    address: '84 Adeniran Ogunsanya St, Surulere, Lagos',
    contactPhone: '+234 800 000 0003',
    type: 'Depot',
    location: { coordinates: [3.3542, 6.4926] },
  },
];

function toMapDealer(d: DealerItem): MapDealer | null {
  if (!d.location?.coordinates) return null;
  const [lng, lat] = d.location.coordinates;
  return {
    id: d._id,
    name: d.name,
    address: d.address,
    phone: d.contactPhone,
    openingHours: d.operatingHours,
    lat,
    lng,
  };
}

export default function DealersPage() {
  const [dealers, setDealers] = useState<DealerItem[]>(FALLBACK_DEALERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [locationStatus, setLocationStatus] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>(LAGOS_CENTER);

  const fetchDealersByLocation = async (lat: number, lng: number) => {
    setIsLoading(true);
    setLocationStatus('Searching nearby dealers...');
    try {
      const res: any = await api.dealers.getNearby(lat, lng, 50);
      const list = res?.data?.data ?? res?.data ?? res;
      if (Array.isArray(list) && list.length > 0) {
        setDealers(list);
        setSelectedId(null);
        setMapCenter([lat, lng]);
        setLocationStatus(`Showing ${list.length} dealer${list.length > 1 ? 's' : ''} near your location`);
      } else {
        setLocationStatus('No nearby dealers found within 50km. Showing all known dealers.');
      }
    } catch (err) {
      console.error('Failed to fetch nearby dealers', err);
      setLocationStatus('Failed to locate nearby dealers. Showing all known dealers.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation is not supported by your browser');
      return;
    }

    setIsLoading(true);
    setLocationStatus('Getting your location...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        fetchDealersByLocation(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {
        console.error(err);
        setIsLoading(false);
        setLocationStatus('Location access denied or unavailable');
      }
    );
  };

  const filteredDealers = dealers.filter(
    (d) =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const mapDealers = useMemo(
    () => filteredDealers.map(toMapDealer).filter((d): d is MapDealer => d !== null),
    [filteredDealers]
  );

  const selectedMapDealer = mapDealers.find((d) => d.id === selectedId) ?? null;

  const handleSelectDealer = (dealer: DealerItem | MapDealer) => {
    const id = '_id' in dealer ? dealer._id : dealer.id;
    setSelectedId(id);
    const md = mapDealers.find((d) => d.id === id);
    if (md) setMapCenter([md.lat, md.lng]);
  };

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
                    onClick={() => handleSelectDealer(dealer)}
                    className={`border rounded-xl p-5 transition-colors cursor-pointer group ${
                      selectedId === dealer._id
                        ? 'border-primary ring-1 ring-primary bg-primary/5'
                        : 'border-border hover:border-primary'
                    }`}
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
                    {dealer.contactPhone && (
                      <div className="flex items-center gap-2 text-text-secondary text-sm">
                        <Phone size={16} className="shrink-0 text-primary" />
                        <span>{dealer.contactPhone}</span>
                      </div>
                    )}
                    <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
                      <span className="text-sm font-medium text-success">
                        {dealer.operatingHours || 'Open Today: 9am - 6pm'}
                      </span>
                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(dealer.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
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
          <div className="w-full md:w-1/2 h-[400px] md:h-auto rounded-xl overflow-hidden border border-border relative">
            <DealerMap
              dealers={mapDealers}
              selectedDealer={selectedMapDealer}
              onSelectDealer={handleSelectDealer}
              center={mapCenter}
            />
            <div className="absolute bottom-3 left-3 right-3 z-[1000] flex justify-center pointer-events-none">
              <Button size="sm" onClick={handleUseLocation} isLoading={isLoading} className="pointer-events-auto shadow-lg">
                Use My Location
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
