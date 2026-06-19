"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays, MapPin, Plus, Trash2, ArrowRight, Compass, Check, Plane,
} from "lucide-react";
import dynamic from "next/dynamic";
import { PageTransition } from "@/components/PageTransition";
import { Filters, type FilterState } from "@/components/Filters";
import { DateRangeSlider } from "@/components/DateRangeSlider";
import { getDestinations, getTours, type Destination, type Tour } from "@/lib/data";
import { isoDate } from "@/lib/utils";
import { useLang } from "@/lib/lang";

const BaliMapNoSSR = dynamic(() => import("@/components/BaliMap").then((mod) => mod.BaliMap), {
  ssr: false, loading: () => <MapFallback />,
});

function MapFallback() {
  return (
    <div className="h-[450px] rounded-2xl bg-bali-sand/20 flex items-center justify-center">
      <div className="text-center"><div className="text-4xl mb-2">🗺️</div><p className="font-serif text-bali-charcoal/40">加载地图中...</p></div>
    </div>
  );
}

const destinations = getDestinations();
const tours = getTours();

const typeLabelsZh: Record<string, string> = { cultural: "文化", beach: "海滩", adventure: "探险", nature: "自然" };
const typeLabelsEn: Record<string, string> = { cultural: "Culture", beach: "Beach", adventure: "Adventure", nature: "Nature" };

export default function BuilderPage() {
  const lang = useLang();
  const [selectedDests, setSelectedDests] = useState<string[]>([]);
  const [days, setDays] = useState<[number, number]>([3, 7]);
  const [filters, setFilters] = useState<FilterState>({ type: "all", difficulty: "all", days: [0, 14], priceRange: [0, 50000] });
  const [generated, setGenerated] = useState(false);
  const departureDate = useMemo(() => isoDate(new Date(Date.now() + 7 * 86400000)), []);

  const selectedDestData = useMemo(() => destinations.filter((d) => selectedDests.includes(d.id)), [selectedDests]);
  const toggleDest = (id: string) => setSelectedDests((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const filteredDests = useMemo(() => {
    return destinations.filter((d: Destination) => {
      if (filters.type !== "all" && d.type !== filters.type) return false;
      return true;
    });
  }, [filters]);

  const matchingTours = useMemo(() => {
    if (selectedDests.length === 0) return [];
    return tours.filter((tour: Tour) => {
      const tourDestIds = tour.itinerary.flatMap((d) => d.destinations);
      const matchCount = selectedDests.filter((id) => tourDestIds.includes(id)).length;
      return matchCount >= selectedDests.length * 0.6;
    });
  }, [selectedDests]);

  const typeLabels = lang === "en" ? typeLabelsEn : typeLabelsZh;
  const l = (href: string) => { const sep = href.includes("?") ? "&" : "?"; return `${href}${sep}lang=${lang}`; };

  return (
    <PageTransition>
      <section className="relative py-20 bg-bali-jungle overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <div className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url(https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1920&q=80)" }} />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="font-serif text-4xl sm:text-5xl font-bold text-white mb-3">
            {lang === "en" ? "Trip Builder" : "行程构建器"}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-white/60 max-w-lg">
            {lang === "en" ? "Select destinations, set your dates, and craft your perfect Bali itinerary" : "选择目的地，设定天数，生成你的专属巴厘岛行程"}
          </motion.p>
        </div>
      </section>

      <section className="py-12 bg-bali-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="font-serif text-xl font-bold text-bali-charcoal mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-bali-sunset" /> {lang === "en" ? "Select Destinations" : "选择目的地"}
                </h2>
                <BaliMapNoSSR destinations={filteredDests} selectedId={undefined} onSelect={(id) => toggleDest(id)} className="h-[450px]" />
                <p className="mt-2 text-xs text-bali-charcoal/40">
                  {lang === "en" ? "Click markers on the map to select or deselect destinations" : "点击地图上的标记来选择或取消目的地"}
                </p>
              </motion.div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-bali-sand/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif text-lg font-bold text-bali-charcoal">{lang === "en" ? "All Destinations" : "所有目的地"}</h3>
                  <Filters filters={filters} onChange={setFilters} onClose={() => {}} />
                </div>
                <div className="grid sm:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto">
                  {filteredDests.map((dest: Destination, i: number) => {
                    const isSelected = selectedDests.includes(dest.id);
                    return (
                      <motion.button key={dest.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.02 }} onClick={() => toggleDest(dest.id)}
                        className={`flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                          isSelected ? "bg-bali-sunset/10 border-2 border-bali-sunset shadow-md" : "bg-bali-sand/20 border-2 border-transparent hover:bg-bali-sand/30"
                        }`}>
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-bali-sand/30 flex items-center justify-center text-sm">
                          {isSelected ? <Check className="w-4 h-4 text-bali-sunset" /> : <Plus className="w-4 h-4 text-bali-charcoal/30" />}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-bali-charcoal truncate">{dest.name}</p>
                          <p className="text-xs text-bali-charcoal/40">{dest.nameEn} · {typeLabels[dest.type] || dest.type}</p>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-bali-sand/30">
                <h3 className="font-serif text-lg font-bold text-bali-charcoal mb-4 flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-bali-sunset" /> {lang === "en" ? "Trip Duration" : "行程天数"}
                </h3>
                <DateRangeSlider min={1} max={14} value={days} onChange={setDays} />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-bali-sand/30">
                <h3 className="font-serif text-lg font-bold text-bali-charcoal mb-4 flex items-center gap-2">
                  <Compass className="w-5 h-5 text-bali-sunset" /> {lang === "en" ? "Selected" : "已选择"} ({selectedDests.length})
                </h3>
                {selectedDests.length === 0 ? (
                  <p className="text-sm text-bali-charcoal/30 py-8 text-center">
                    {lang === "en" ? "Click the map or list to select destinations" : "点击地图或列表选择目的地"}
                  </p>
                ) : (
                  <div className="space-y-2 mb-4">
                    <AnimatePresence>
                      {selectedDestData.map((dest) => (
                        <motion.div key={dest.id} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }} className="flex items-center gap-3 py-2 px-3 rounded-lg bg-bali-sand/20">
                          <div className="flex-1 min-w-0"><p className="text-sm font-medium text-bali-charcoal truncate">{dest.name}</p><p className="text-xs text-bali-charcoal/40">{dest.duration}</p></div>
                          <button onClick={() => toggleDest(dest.id)} className="text-bali-charcoal/20 hover:text-bali-sunset transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
                <button onClick={() => setGenerated(true)} disabled={selectedDests.length === 0}
                  className="w-full py-3 bg-bali-jungle text-white rounded-full font-medium hover:bg-bali-jungle/90 transition-colors shadow-md shadow-bali-jungle/20 disabled:opacity-30 disabled:cursor-not-allowed">
                  {lang === "en" ? "Generate Itinerary" : "生成行程"}
                </button>
                <Link href={l(`/flights?date=${departureDate}`)}
                  className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-full border border-bali-ocean/30 text-bali-ocean text-sm font-medium hover:bg-bali-ocean/5 transition-colors">
                  <Plane className="w-4 h-4" /> {lang === "en" ? "View Flights" : "查看航班行情"}
                </Link>
              </motion.div>

              {matchingTours.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-bali-sand/30">
                  <h3 className="font-serif text-lg font-bold text-bali-charcoal mb-4">
                    {lang === "en" ? "Matching Tours" : "匹配的预置线路"}
                  </h3>
                  <div className="space-y-3">
                    {matchingTours.map((tour: Tour) => (
                      <a key={tour.id} href={l(`/tours/${tour.slug}`)}
                        className="block p-3 rounded-xl border border-bali-sand/30 hover:border-bali-sunset/50 hover:bg-bali-sunset/5 transition-all">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-cover bg-center flex-shrink-0" style={{ backgroundImage: `url(${tour.coverImage})` }} />
                          <div className="min-w-0"><p className="text-sm font-medium text-bali-charcoal truncate">{tour.title}</p><p className="text-xs text-bali-charcoal/40">{tour.days}{lang === "en" ? " days" : "天"} · {tour.type}</p></div>
                          <ArrowRight className="w-4 h-4 text-bali-charcoal/20 flex-shrink-0" />
                        </div>
                      </a>
                    ))}
                  </div>
                </motion.div>
              )}

              {generated && selectedDests.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-bali-sunset/30">
                  <div className="flex items-center gap-2 mb-4"><Check className="w-5 h-5 text-bali-jungle" /><h3 className="font-serif text-lg font-bold text-bali-charcoal">{lang === "en" ? "Itinerary Generated" : "行程已生成"}</h3></div>
                  <div className="space-y-3">
                    {selectedDestData.map((dest, i) => (
                      <div key={dest.id} className="flex items-center gap-3 text-sm">
                        <div className="w-6 h-6 rounded-full bg-bali-sunset/10 text-bali-sunset flex items-center justify-center text-xs font-bold flex-shrink-0">{String(i + 1).padStart(2, "0")}</div>
                        <span className="text-bali-charcoal">{dest.name}</span><span className="text-bali-charcoal/30 text-xs ml-auto">{dest.duration}</span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 pt-4 border-t border-bali-sand/30 text-xs text-bali-charcoal/40 text-center">{days[0]}–{days[1]} {lang === "en" ? "days" : "天"} · {selectedDests.length} {lang === "en" ? "destinations" : "个目的地"}</p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
