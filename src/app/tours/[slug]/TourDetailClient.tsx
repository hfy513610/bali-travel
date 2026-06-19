"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft, CalendarDays, MapPin, Star, Check, X, ChevronDown, ChevronUp,
} from "lucide-react";
import { useState, useMemo, useCallback } from "react";
import { PageTransition } from "@/components/PageTransition";
import dynamic from "next/dynamic";
import { WeatherCard } from "@/components/weather/WeatherCard";
import { WeatherRecommendation } from "@/components/recommendation/WeatherRecommendation";
import { regionForDestination } from "@/lib/weather-utils";
import { formatPrice } from "@/lib/utils";
import type { Tour, Destination } from "@/lib/data";
import { useLang } from "@/lib/lang";

const BaliMap = dynamic(() => import("@/components/BaliMap").then((mod) => mod.BaliMap), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] rounded-2xl bg-bali-sand/20 flex items-center justify-center">
      <p className="font-serif text-bali-charcoal/40">加载地图中...</p>
    </div>
  ),
});

interface TourDetailClientProps { tour: Tour; destinations: Destination[]; }

export function TourDetailClient({ tour, destinations }: TourDetailClientProps) {
  const lang = useLang();
  const [expandedDay, setExpandedDay] = useState<number>(tour.itinerary[0]?.day ?? 1);
  const [selectedDest, setSelectedDest] = useState<string>();
  const [weatherMain, setWeatherMain] = useState<string>();

  const weatherRegion = useMemo(() => {
    if (selectedDest) return regionForDestination(selectedDest);
    const firstDestId = tour.itinerary[0]?.destinations[0];
    return firstDestId ? regionForDestination(firstDestId) : "denpasar";
  }, [selectedDest, tour]);

  const handleWeatherLoaded = useCallback((main: string) => {
    setWeatherMain(main);
  }, []);

  const l = (href: string) => {
    const sep = href.includes("?") ? "&" : "?";
    return `${href}${sep}lang=${lang}`;
  };

  return (
    <PageTransition>
      <section className="relative h-[60vh] min-h-[400px] flex items-end">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${tour.coverImage})` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />
        <Link href={l("/tours")}
          className="absolute top-6 left-6 z-10 flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white text-sm border border-white/20 hover:bg-white/20 transition-colors">
          <ArrowLeft className="w-4 h-4" /> {lang === "en" ? "Back" : "返回线路"}
        </Link>
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <span className="inline-block px-3 py-1 rounded-full bg-bali-sunset/90 text-white text-xs font-medium mb-4">{tour.title}</span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">{tour.title}</h1>
            <p className="text-white/70 max-w-lg">{tour.subtitle}</p>
            <div className="flex flex-wrap items-center gap-4 mt-5 text-sm text-white/70">
              <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-bali-gold" fill="#C9A96E" />{tour.rating} ({tour.reviewCount} {lang === "en" ? "reviews" : "条评价"})</span>
              <span className="flex items-center gap-1.5"><CalendarDays className="w-4 h-4" />{tour.days}{lang === "en" ? " days" : "天"}</span>
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />{tour.itinerary.length} {lang === "en" ? "stops" : "站"}</span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-bali-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-8">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-bali-sand/30">
                <h2 className="font-serif text-xl font-bold text-bali-charcoal mb-3">
                  {lang === "en" ? "Overview" : "线路概述"}
                </h2>
                <p className="text-bali-charcoal/70 leading-relaxed">{tour.description}</p>
              </motion.div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-bali-sand/30">
                <h2 className="font-serif text-xl font-bold text-bali-charcoal mb-6">
                  {lang === "en" ? "Daily Itinerary" : "每日行程"}
                </h2>
                <div className="space-y-3">
                  {tour.itinerary.map((day, i) => (
                    <motion.div key={day.day} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.35 + i * 0.05 }} className="border border-bali-sand/30 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setExpandedDay(expandedDay === day.day ? -1 : day.day)}
                        className="w-full flex items-center gap-4 p-4 hover:bg-bali-sand/10 transition-colors text-left">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-bali-sunset/10 text-bali-sunset flex items-center justify-center font-serif font-bold text-sm">
                          {String(day.day).padStart(2, "0")}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-bali-charcoal truncate">{day.title}</h3>
                          <p className="text-xs text-bali-charcoal/40 mt-0.5">{day.activities.length} {lang === "en" ? "activities" : "项活动"}</p>
                        </div>
                        {expandedDay === day.day ? <ChevronUp className="w-4 h-4 text-bali-charcoal/30 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-bali-charcoal/30 flex-shrink-0" />}
                      </button>
                      {expandedDay === day.day && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="px-4 pb-4 space-y-3">
                          <div>
                            <h4 className="text-xs uppercase tracking-wider text-bali-charcoal/40 mb-2">
                              {lang === "en" ? "Activities" : "活动安排"}
                            </h4>
                            <div className="space-y-1.5">
                              {day.activities.map((a) => (
                                <div key={a} className="flex items-start gap-2 text-sm text-bali-charcoal/70">
                                  <div className="w-1.5 h-1.5 rounded-full bg-bali-sunset mt-1.5 flex-shrink-0" />{a}
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-xs uppercase tracking-wider text-bali-charcoal/40 mb-1">
                              {lang === "en" ? "Meals" : "餐饮"}
                            </h4>
                            <p className="text-sm text-bali-charcoal/60">{day.meal}</p>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="font-serif text-xl font-bold text-bali-charcoal mb-4">
                  {lang === "en" ? "Tour Map" : "行程地图"}
                </h2>
                <BaliMap destinations={destinations} center={tour.mapCenter} zoom={tour.mapZoom}
                  selectedId={selectedDest} onSelect={setSelectedDest} className="h-[400px]" />
              </div>
            </div>

            <div className="space-y-6">
              <WeatherCard defaultRegion={weatherRegion} key={weatherRegion}
                onWeatherLoaded={handleWeatherLoaded}
                onRegionChange={(rid) => {
                  const match = destinations.find((d) => regionForDestination(d.id) === rid);
                  if (match) setSelectedDest(match.id);
                }} />

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-bali-sand/30">
                <div className="text-center mb-6">
                  <p className="text-sm text-bali-charcoal/40 mb-1">{lang === "en" ? "Starting from" : "每人起价"}</p>
                  <div className="font-serif text-4xl font-bold text-bali-sunset">{formatPrice(tour.price)}</div>
                  <p className="text-xs text-bali-charcoal/30 mt-1">{tour.currency}</p>
                </div>
                <Link href={l(`/builder?tour=${tour.slug}`)}
                  className="block w-full py-3 bg-bali-sunset text-white text-center rounded-full font-medium hover:bg-bali-sunset/90 transition-colors shadow-md shadow-bali-sunset/20">
                  {lang === "en" ? "Customize This Tour" : "定制此线路"}
                </Link>
                <div className="mt-6 space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-bali-charcoal mb-3 flex items-center gap-2"><Check className="w-4 h-4 text-bali-jungle" />{lang === "en" ? "Included" : "费用包含"}</h3>
                    <div className="space-y-2">
                      {tour.includes.map((item) => (
                        <div key={item} className="flex items-start gap-2 text-sm text-bali-charcoal/60"><Check className="w-3.5 h-3.5 text-bali-jungle mt-0.5 flex-shrink-0" />{item}</div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-bali-charcoal mb-3 flex items-center gap-2"><X className="w-4 h-4 text-bali-sunset" />{lang === "en" ? "Not Included" : "费用不含"}</h3>
                    <div className="space-y-2">
                      {tour.excludes.map((item) => (
                        <div key={item} className="flex items-start gap-2 text-sm text-bali-charcoal/40"><X className="w-3.5 h-3.5 text-bali-charcoal/30 mt-0.5 flex-shrink-0" />{item}</div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-bali-sand/30">
                  <h3 className="text-sm font-medium text-bali-charcoal mb-3">{lang === "en" ? "Highlights" : "行程亮点"}</h3>
                  <div className="flex flex-wrap gap-2">
                    {tour.highlights.map((h) => (
                      <span key={h} className="px-3 py-1 rounded-full bg-bali-gold/10 text-bali-gold text-xs font-medium">{h}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          <div className="mt-12">
            <WeatherRecommendation weatherMain={weatherMain} />
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
