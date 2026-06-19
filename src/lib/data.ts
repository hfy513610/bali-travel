export interface Destination {
  id: string;
  name: string;
  nameEn: string;
  region: string;
  lat: number;
  lng: number;
  type: "cultural" | "beach" | "adventure" | "nature";
  rating: number;
  description: string;
  highlights: string[];
  bestTime: string;
  duration: string;
  image: string;
}

export interface TourDay {
  day: number;
  title: string;
  destinations: string[];
  activities: string[];
  meal: string;
}

export interface Tour {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  days: number;
  price: number;
  currency: string;
  type: "culture" | "adventure" | "romance" | "wellness";
  rating: number;
  reviewCount: number;
  coverImage: string;
  weatherTags: string[];
  weight?: number;
  itinerary: TourDay[];
  highlights: string[];
  includes: string[];
  excludes: string[];
  difficulty: "easy" | "medium" | "hard";
  mapCenter: [number, number];
  mapZoom: number;
}

import destinations from "@/data/destinations.json";
import tours from "@/data/tours.json";

export function getDestinations(): Destination[] {
  return destinations as Destination[];
}

export function getDestination(id: string): Destination | undefined {
  return (destinations as Destination[]).find((d) => d.id === id);
}

export function getTours(): Tour[] {
  return tours as Tour[];
}

export function getTour(slug: string): Tour | undefined {
  return (tours as Tour[]).find((t) => t.slug === slug);
}

export function getTourDestinations(tour: Tour): Destination[] {
  const allDestinations = getDestinations();
  const ids = new Set(tour.itinerary.flatMap((day) => day.destinations));
  return allDestinations.filter((d) => ids.has(d.id));
}

export function getDestinationsByType(type: string): Destination[] {
  return (destinations as Destination[]).filter((d) => d.type === type);
}

export function getToursByType(type: string): Tour[] {
  return (tours as Tour[]).filter((t) => t.type === type);
}
