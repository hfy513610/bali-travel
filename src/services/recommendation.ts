"use server";

import type { Tour } from "@/lib/data";
import toursData from "@/data/tours.json";

export type WeatherTag = "sunny" | "rainy" | "foggy" | "all";

export interface RecommendationItem {
  tour: Tour;
  tag: WeatherTag;
}

export interface RecommendationResult {
  items: RecommendationItem[];
  tip: string; // single tip string based on the requested lang
}

/** Map tag → locale-specific tips */
const tips: Record<string, { zh: string; en: string }> = {
  sunny: {
    zh: "今日晴好，正是探索巴厘岛的好时光！海滩、冲浪、日落巡礼都超赞。",
    en: "Sunny skies ahead — perfect for beach hopping, surfing, and sunset cruises!",
  },
  rainy: {
    zh: "今日有雨，不如选择避雨的深度文化体验——寺庙、SPA、传统工坊。",
    en: "Rain today? Dive into Bali's cultural gems — temples, spas, and artisan workshops instead!",
  },
  foggy: {
    zh: "今日雾气朦胧，适合慢节奏的高地寺庙探访与山谷静修之旅。",
    en: "Misty vibes — ideal for exploring highland temples and slow-paced wellness retreats.",
  },
  all: {
    zh: "无论天气如何，巴厘岛总有惊喜等着你！",
    en: "Whatever the weather, Bali always has something special in store!",
  },
};

/** All server actions must be async */

/**
 * Map OWM weather[0].main → weather tag (server action).
 */
export async function mapWeatherToTagServer(weatherMain: string): Promise<WeatherTag> {
  return mapWeatherToTag(weatherMain);
}

/**
 * Get weather-based tour recommendations.
 *
 * @param weatherMain  OWM weather[0].main string
 * @param lang         'zh' or 'en' — passed explicitly, NOT from Context
 * @param limit        Max results
 */
export async function getRecommendations(
  weatherMain: string,
  lang: string = "zh",
  limit = 3
): Promise<RecommendationResult> {
  const tag = mapWeatherToTag(weatherMain);
  const tours = (toursData as Tour[]).filter(
    (t) => t.weatherTags && t.weatherTags.includes(tag)
  );

  const sorted = [...tours].sort(
    (a, b) => (b.weight ?? 0) - (a.weight ?? 0) || b.rating - a.rating
  );

  const items: RecommendationItem[] = sorted.slice(0, limit).map((t) => ({
    tour: t,
    tag,
  }));

  const tipEntry = tips[tag] ?? tips.all;
  const tip = lang === "en" ? tipEntry.en : tipEntry.zh;

  return { items, tip };
}

/* ─── internal ─── */
function mapWeatherToTag(weatherMain: string): WeatherTag {
  const m = weatherMain.toLowerCase();
  if (m === "clear" || m === "clouds") return "sunny";
  if (m === "rain" || m === "drizzle" || m === "thunderstorm") return "rainy";
  if (m === "mist" || m === "haze" || m === "fog" || m === "smoke") return "foggy";
  return "all";
}
