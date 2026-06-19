"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Sun, CloudRain, CloudFog } from "lucide-react";
import type { RecommendationResult } from "@/services/recommendation";
import { useLang } from "@/lib/lang";
import { cn } from "@/lib/utils";

function mapWeatherToTagClient(weatherMain: string): string {
  const m = weatherMain.toLowerCase();
  if (m === "clear" || m === "clouds") return "sunny";
  if (m === "rain" || m === "drizzle" || m === "thunderstorm") return "rainy";
  if (m === "mist" || m === "haze" || m === "fog" || m === "smoke") return "foggy";
  return "all";
}

// Inline translation map — no more @/locales imports
const labels: Record<string, Record<string, string>> = {
  zh: {
    "recommendation.title": "智能天气推荐",
    "recommendation.subtitle": "根据当前天气为您推荐最合适的线路",
    "recommendation.viewDetail": "查看详情",
    "recommendation.noRecommendation": "暂无推荐，探索全部线路",
    "recommendation.exploreAll": "查看全部线路",
    "weather.sunny": "晴好",
    "weather.rainy": "雨天",
    "weather.foggy": "雾天",
    "weather.all": "通用",
    "common.days": "天",
  },
  en: {
    "recommendation.title": "Smart Weather Picks",
    "recommendation.subtitle": "Tours best suited for today's weather",
    "recommendation.viewDetail": "View Detail",
    "recommendation.noRecommendation": "No recommendations yet — explore all tours",
    "recommendation.exploreAll": "View All Tours",
    "weather.sunny": "Sunny",
    "weather.rainy": "Rainy",
    "weather.foggy": "Foggy",
    "weather.all": "All",
    "common.days": "days",
  },
};

interface WeatherRecommendationProps {
  weatherMain?: string;
  className?: string;
}

const tagIcons: Record<string, typeof Sun> = {
  sunny: Sun, rainy: CloudRain, foggy: CloudFog, all: Sparkles,
};

const tagColors: Record<string, string> = {
  sunny: "bg-amber-100 text-amber-700 border-amber-200",
  rainy: "bg-blue-100 text-blue-700 border-blue-200",
  foggy: "bg-slate-100 text-slate-600 border-slate-200",
  all: "bg-bali-sand/30 text-bali-charcoal border-bali-sand/40",
};

export function WeatherRecommendation({ weatherMain, className }: WeatherRecommendationProps) {
  const lang = useLang();
  const t = (path: string) => labels[lang]?.[path] ?? path;
  const [result, setResult] = useState<RecommendationResult | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchRecommendations = useCallback(async (main: string, l: string) => {
    setLoading(true);
    try {
      const { getRecommendations } = await import("@/services/recommendation");
      const r = await getRecommendations(main, l);
      setResult(r);
    } catch {
      setResult(null);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    if (weatherMain) {
      fetchRecommendations(weatherMain, lang);
    } else {
      setLoading(false);
      setResult(null);
    }
  }, [weatherMain, lang, fetchRecommendations]);

  if (!weatherMain) return null;

  const tag = mapWeatherToTagClient(weatherMain);
  const TagIcon = tagIcons[tag] ?? Sparkles;

  const l = (href: string) => {
    const sep = href.includes("?") ? "&" : "?";
    return `${href}${sep}lang=${lang}`;
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      className={cn("py-16", className)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-bali-sunset/10 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-bali-sunset" />
          </div>
          <div>
            <h2 className="font-serif text-2xl font-bold text-bali-charcoal">{t("recommendation.title")}</h2>
            <p className="text-sm text-bali-charcoal/40">{t("recommendation.subtitle")}</p>
          </div>
          <span className={cn("ml-auto px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1", tagColors[tag])}>
            <TagIcon className="w-3.5 h-3.5" />
            {t(`weather.${tag}`)}
          </span>
        </div>

        {result && (
          <motion.p
            key={`${weatherMain}-${lang}`}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 text-sm text-bali-charcoal/60 italic"
          >
            {result.tip}
          </motion.p>
        )}

        <div className="mt-6">
          {loading ? (
            <div className="flex gap-4 overflow-hidden">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex-shrink-0 w-72 h-48 rounded-2xl bg-bali-sand/10 animate-pulse" />
              ))}
            </div>
          ) : result && result.items.length > 0 ? (
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
              {result.items.map((item, i) => (
                <Link key={`${item.tour.id}-${lang}`} href={l(`/tours/${item.tour.slug}`)}
                  className="flex-shrink-0 w-72 snap-start group">
                  <motion.div
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                    className="relative overflow-hidden rounded-2xl border border-transparent bg-gradient-to-br from-bali-sand/20 via-white to-bali-gold/10 p-[1px]">
                    <div className="h-full bg-white rounded-2xl overflow-hidden shadow-md group-hover:shadow-lg transition-shadow">
                      <div className="relative h-36 overflow-hidden">
                        <div className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                          style={{ backgroundImage: `url(${item.tour.coverImage})` }} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <span className={cn("absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-medium border", tagColors[tag])}>
                          <TagIcon className="w-3 h-3 inline mr-0.5" />{t(`weather.${item.tag}`)}
                        </span>
                      </div>
                      <div className="p-4 space-y-2">
                        <h4 className="font-serif font-bold text-bali-charcoal group-hover:text-bali-sunset transition-colors line-clamp-1">
                          {item.tour.title}
                        </h4>
                        <p className="text-xs text-bali-charcoal/50 line-clamp-2">{item.tour.subtitle}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-bali-charcoal/40">
                            {item.tour.days}{t("common.days")} · ★{item.tour.rating}
                          </span>
                          <span className="text-xs text-bali-sunset font-medium flex items-center gap-0.5 group-hover:gap-1 transition-all">
                            {t("recommendation.viewDetail")} <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-10 text-bali-charcoal/40">
              <p className="text-sm">{t("recommendation.noRecommendation")}</p>
              <Link href={l("/tours")} className="inline-flex items-center gap-1 mt-3 text-xs text-bali-sunset hover:underline">
                {t("recommendation.exploreAll")} <ArrowRight className="w-3 h-3" />
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </motion.section>
  );
}
