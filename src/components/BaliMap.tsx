"use client";

import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Destination } from "@/lib/data";

const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const activeIcon = L.icon({
  iconUrl:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='48' viewBox='0 0 24 24' fill='none' stroke='%23E07A5F' stroke-width='2.5'%3E%3Cpath d='M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z'/%3E%3Ccircle cx='12' cy='10' r='3'/%3E%3C/svg%3E",
  iconSize: [32, 48],
  iconAnchor: [16, 48],
  popupAnchor: [0, -48],
});

interface BaliMapProps {
  destinations: Destination[];
  center?: [number, number];
  zoom?: number;
  selectedId?: string;
  onSelect?: (id: string) => void;
  className?: string;
}

function FlyTo({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => { map.flyTo(center, zoom, { duration: 1.5 }); }, [map, center, zoom]);
  return null;
}

export function BaliMap({
  destinations,
  center = [-8.4095, 115.1889],
  zoom = 9,
  selectedId,
  onSelect,
  className = "h-[500px]",
}: BaliMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) {
    return (
      <div className={`${className} bg-bali-sand/20 rounded-2xl flex items-center justify-center`}>
        <p className="text-bali-charcoal/40 font-serif">加载地图中...</p>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl overflow-hidden shadow-lg ${className}`}>
      <MapContainer center={center} zoom={zoom} scrollWheelZoom={true} className="h-full w-full" ref={mapRef}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        <FlyTo center={center} zoom={zoom} />
        {destinations.map((dest) => (
          <Marker
            key={dest.id}
            position={[dest.lat, dest.lng]}
            icon={dest.id === selectedId ? activeIcon : defaultIcon}
            eventHandlers={{ click: () => onSelect?.(dest.id) }}
          >
            <Popup>
              <div className="min-w-[160px]">
                <h4 className="font-serif text-sm font-bold text-bali-charcoal">{dest.name}</h4>
                <p className="text-xs text-bali-charcoal/60 mt-1">{dest.nameEn}</p>
                <div className="flex items-center gap-1 mt-1.5">
                  <span className="text-bali-gold text-xs">★</span>
                  <span className="text-xs text-bali-charcoal/60">{dest.rating}</span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
