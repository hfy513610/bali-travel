/**
 * Pure client-safe utility helpers — NOT a server action.
 * These are used by React components, not by server code.
 */

import type { BaliRegion } from "@/types/weather";

/** Bali's four regions (duplicated for client safety, no server imports) */
export const BALI_REGIONS_CLIENT: BaliRegion[] = [
  { id: "denpasar", name: "登巴萨", nameEn: "Denpasar", lat: -8.6705, lng: 115.2126 },
  { id: "ubud", name: "乌布", nameEn: "Ubud", lat: -8.5069, lng: 115.2625 },
  { id: "nusa-dua", name: "努沙杜瓦", nameEn: "Nusa Dua", lat: -8.8055, lng: 115.2232 },
  { id: "jimbaran", name: "金巴兰", nameEn: "Jimbaran", lat: -8.7897, lng: 115.1593 },
];

/** OWM icon code → icon-name slug for lucide mapping */
export function weatherIconName(icon: string): string {
  const m: Record<string, string> = {
    "01d": "sun", "01n": "moon",
    "02d": "cloud-sun", "02n": "cloud-moon",
    "03d": "cloud", "03n": "cloud",
    "04d": "clouds", "04n": "clouds",
    "09d": "cloud-drizzle", "09n": "cloud-drizzle",
    "10d": "cloud-rain", "10n": "cloud-rain",
    "11d": "cloud-lightning", "11n": "cloud-lightning",
    "13d": "cloud-snow", "13n": "cloud-snow",
    "50d": "cloud-fog", "50n": "cloud-fog",
  };
  return m[icon] ?? "cloud-sun";
}

/** Match destination id → closest weather region */
export function regionForDestination(destId: string): string {
  const map: Record<string, string> = {
    ubud: "ubud",
    seminyak: "denpasar",
    canggu: "denpasar",
    uluwatu: "jimbaran",
    "nusa-penida": "denpasar",
    "nusa-dua": "nusa-dua",
    sidemen: "ubud",
    bedugul: "ubud",
  };
  return map[destId] ?? "denpasar";
}
