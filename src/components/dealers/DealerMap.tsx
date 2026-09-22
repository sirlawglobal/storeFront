'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Leaflet's default marker icons reference image files that bundlers don't
// resolve correctly, so point them at the CDN copies shipped with the package.
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const selectedIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [30, 49],
  iconAnchor: [15, 49],
  popupAnchor: [1, -40],
  shadowSize: [49, 49],
  className: 'dealer-marker-selected',
});

export interface MapDealer {
  id: string;
  name: string;
  address: string;
  phone?: string;
  openingHours?: string;
  lat: number;
  lng: number;
}

function FlyToSelected({ dealer }: { dealer: MapDealer | null }) {
  const map = useMap();
  useEffect(() => {
    if (dealer) {
      map.flyTo([dealer.lat, dealer.lng], 15, { duration: 0.75 });
    }
  }, [dealer, map]);
  return null;
}

interface DealerMapProps {
  dealers: MapDealer[];
  selectedDealer: MapDealer | null;
  onSelectDealer: (dealer: MapDealer) => void;
  center: [number, number];
}

export default function DealerMap({ dealers, selectedDealer, onSelectDealer, center }: DealerMapProps) {
  return (
    <MapContainer
      center={center}
      zoom={dealers.length ? 12 : 6}
      scrollWheelZoom
      style={{ height: '100%', width: '100%', borderRadius: '0.75rem' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FlyToSelected dealer={selectedDealer} />
      {dealers.map((dealer) => (
        <Marker
          key={dealer.id}
          position={[dealer.lat, dealer.lng]}
          icon={selectedDealer?.id === dealer.id ? selectedIcon : defaultIcon}
          eventHandlers={{ click: () => onSelectDealer(dealer) }}
        >
          <Popup>
            <div className="text-sm">
              <p className="font-bold mb-1">{dealer.name}</p>
              <p className="mb-1">{dealer.address}</p>
              {dealer.phone && <p className="mb-1">{dealer.phone}</p>}
              {dealer.openingHours && <p className="text-gray-600">{dealer.openingHours}</p>}
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(dealer.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-semibold underline"
              >
                Get Directions
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
