"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal } from "lucide-react";
import { PageTransition } from "@/components/PageTransition";
import { TourCard } from "@/components/TourCard";
import { Filters, type FilterState } from "@/components/Filters";
import { getTours, getDestinations, type Tour } from "@/lib/data";
import { useLang } from "@/lib/lang";

const BaliMap = dynamic(() => import("@/components/BaliMap").then((m) => m.BaliMap), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] rounded-2xl bg-bali-sand/20 flex items-center justify-center">
      <p className="font-serif text-bali-charcoal/40">加载地图中...</p>
    </div>
  ),
});

const tours = getTours();
const destinations = getDestinations();

export default function ToursPage() {
  const lang = useLang();
  const [filters, setFilters] = useState<FilterState>({ type: "all", difficulty: "all", days: [0, 14], priceRange: [0, 50000] });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMapId, setSelectedMapId] = useState<string>();

  const filteredTours = useMemo(() => {
    return tours.filter((tour: Tour) => {
      if (filters.type !== "all" && tour.type !== filters.type) return false;
      if (filters.difficulty !== "all" && tour.difficulty !== filters.difficulty) return false;
      if (tour.days < filters.days[0] || tour.days > filters.days[1]) return false;
      if (tour.price < filters.priceRange[0] || tour.price > filters.priceRange[1]) return false;
      return true;
    });
  }, [filters]);

  const l = (href: string) => { const sep = href.includes("?") ? "&" : "?"; return `${href}${sep}lang=${lang}`; };

  return (
    <PageTransition>
      <section className="relative py-20 bg-bali-charcoal overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url(https://images.unsplash.com/photo-1573790387438-4da905039392?w=1920&q=80)" }} />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="font-serif text-4xl sm:text-5xl font-bold text-white mb-3">
            {lang === "en" ? "Explore Tours" : "探索线路"}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-white/60 max-w-lg">
            {lang === "en" ? "From cultural deep-dives to island adventures — find your perfect Bali journey" : "从文化深度之旅到海岛探险，找到属于你的完美巴厘旅程"}
          </motion.p>
        </div>
      </section>

      <section className="py-12 bg-bali-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <p className="text-sm text-bali-charcoal/50">
              {lang === "en" ? "Found " : "共找到 "}
              <span className="text-bali-charcoal font-medium">{filteredTours.length}</span>
              {lang === "en" ? " tours" : " 条线路"}
            </p>
            <button onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-bali-sand/40 text-sm font-medium text-bali-charcoal/70 hover:text-bali-sunset hover:border-bali-sunset/30 transition-all shadow-sm">
              <SlidersHorizontal className="w-4 h-4" /> {lang === "en" ? "Filter" : "筛选"}
            </button>
          </div>

          <div className="flex gap-8">
            <AnimatePresence>
              {showFilters && (
                <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: "auto", opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }} className="flex-shrink-0 overflow-hidden">
                  <div className="w-72">
                    <Filters filters={filters} onChange={setFilters} onClose={() => setShowFilters(false)} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex-1">
              {filteredTours.length > 0 ? (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredTours.map((tour, i) => {
                    // Wrap TourCard with lang-aware link
                    return (
                      <Link key={tour.id} href={l(`/tours/${tour.slug}`)} className="block">
                        <TourCard tour={tour} index={i} />
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                  <p className="font-serif text-xl text-bali-charcoal/40">
                    {lang === "en" ? "No matching tours found" : "没有找到匹配的线路"}
                  </p>
                  <button onClick={() => setFilters({ type: "all", difficulty: "all", days: [0, 14], priceRange: [0, 50000] })}
                    className="mt-4 text-sm text-bali-sunset hover:underline">
                    {lang === "en" ? "Reset all filters" : "重置全部筛选条件"}
                  </button>
                </motion.div>
              )}
            </div>
          </div>

          <div className="mt-16">
            <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="font-serif text-2xl font-bold text-bali-charcoal mb-6">
              {lang === "en" ? "Destinations Overview" : "目的地一览"}
            </motion.h2>
            <BaliMap destinations={destinations} selectedId={selectedMapId} onSelect={setSelectedMapId} />
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
