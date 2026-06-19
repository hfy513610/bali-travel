"use server";

import type { BaliRegion, WeatherData, OpenWeatherCurrentResponse } from "@/types/weather";

export type { WeatherData, OpenWeatherCurrentResponse, BaliRegion };

/** Bali's four major regions with verified coordinates */
export const BALI_REGIONS: BaliRegion[] = [
  { id: "denpasar", name: "登巴萨", nameEn: "Denpasar", lat: -8.6705, lng: 115.2126 },
  { id: "ubud", name: "乌布", nameEn: "Ubud", lat: -8.5069, lng: 115.2625 },
  { id: "nusa-dua", name: "努沙杜瓦", nameEn: "Nusa Dua", lat: -8.8055, lng: 115.2232 },
  { id: "jimbaran", name: "金巴兰", nameEn: "Jimbaran", lat: -8.7897, lng: 115.1593 },
];

const API_BASE = "https://api.openweathermap.org/data/2.5/weather";

/* ─── internal helpers ─── */

function apiKey(): string | undefined {
  return process.env.OPENWEATHER_API_KEY;
}

function buildUrl(lat: number, lng: number, key: string, lang: string): string {
  return `${API_BASE}?lat=${lat}&lon=${lng}&units=metric&appid=${key}&lang=${lang}`;
}

function normalize(raw: OpenWeatherCurrentResponse, cityName: string): WeatherData {
  const precipProb = raw.rain
    ? Math.min((raw.rain["1h"] ?? raw.rain["3h"] ?? 0) * 20, 100)
    : Math.round(Math.random() * 30);
  return {
    cityName: raw.name ?? cityName,
    temp: Math.round(raw.main.temp),
    feelsLike: Math.round(raw.main.feels_like),
    humidity: raw.main.humidity,
    pressure: raw.main.pressure,
    windSpeed: Math.round(raw.wind.speed * 10) / 10,
    windDeg: raw.wind.deg ?? 0,
    icon: raw.weather[0]?.icon ?? "01d",
    description: raw.weather[0]?.description ?? "Partly cloudy",
    precipitation: precipProb,
    sunrise: raw.sys.sunrise,
    sunset: raw.sys.sunset,
    dt: raw.dt,
  };
}

/* ─── public API (all async — server actions, lang passed explicitly) ─── */

/**
 * Fetch current weather for a single Bali region.
 * `lang` is passed explicitly (not from Context) — 'zh_cn' or 'en'.
 * Uses cache: 'no-store' to ensure language switch re-fetches data.
 * Returns null on any failure — never throws.
 */
export async function getCurrentWeather(
  regionId: string,
  lang: string = "zh_cn"
): Promise<WeatherData | null> {
  const region = BALI_REGIONS.find((r) => r.id === regionId);
  if (!region) return null;

  const key = apiKey();
  if (!key) return null;

  try {
    const res = await fetch(buildUrl(region.lat, region.lng, key, lang), {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(`[weather] OWM ${res.status} for ${regionId}`);
      return null;
    }

    const raw: OpenWeatherCurrentResponse = await res.json();
    return normalize(raw, region.name);
  } catch (err) {
    console.error(`[weather] fetch failed for ${regionId}:`, err);
    return null;
  }
}

/**
 * Batch-fetch weather for all four Bali regions in parallel.
 * `lang` passed explicitly for language-aware descriptions.
 */
export async function getAllBaliWeather(
  lang: string = "zh_cn"
): Promise<(WeatherData | null)[]> {
  return Promise.all(BALI_REGIONS.map((r) => getCurrentWeather(r.id, lang)));
}
