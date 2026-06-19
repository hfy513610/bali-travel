"use client";

import { Suspense, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plane, ArrowLeft, CalendarDays } from "lucide-react";
import { PageTransition } from "@/components/PageTransition";
import { useLang } from "@/lib/lang";

const FlightWidget = dynamic(() => import("@/components/flights/FlightWidget"), {
  ssr: false,
  loading: () => (
    <div className="space-y-6">
      <div className="h-72 bg-white rounded-2xl animate-pulse border border-bali-sand/30" />
      <div className="h-[700px] bg-white rounded-2xl animate-pulse border border-bali-sand/30" />
    </div>
  ),
});

export default function FlightsPage() {
  const lang = useLang();
  const [searchParams] = useState(() => {
    if (typeof window === "undefined") return new URLSearchParams();
    return new URLSearchParams(window.location.search);
  });
  const departureDate = searchParams.get("date") ?? undefined;

  const l = (href: string) => { const sep = href.includes("?") ? "&" : "?"; return `${href}${sep}lang=${lang}`; };

  return (
    <PageTransition>
      <section className="relative py-16 bg-bali-ocean overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url(https://images.unsplash.com/photo-1436491865332-7a61a109bb05?w=1920&q=80)" }} />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href={l("/")} className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> {lang === "en" ? "Back Home" : "返回首页"}
          </Link>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="font-serif text-4xl sm:text-5xl font-bold text-white mb-3 flex items-center gap-3">
            <Plane className="w-8 h-8 text-bali-gold" /> {lang === "en" ? "Flights" : "航班行情"}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-white/60 max-w-lg">
            {lang === "en" ? "Search flights from Chongqing (CKG) to Bali (DPS) with live price trends" : "搜索重庆(CKG)至巴厘岛(DPS)的实时航班与价格趋势"}
          </motion.p>
          {departureDate && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white/80 text-sm border border-white/20">
              <CalendarDays className="w-4 h-4 text-bali-gold" />
              {lang === "en" ? "Synced departure date from Trip Builder: " : "已同步行程构建器的出发日期："}
              {new Date(departureDate).toLocaleDateString(lang === "en" ? "en-US" : "zh-CN", { year: "numeric", month: "long", day: "numeric" })}
            </motion.div>
          )}
        </div>
      </section>

      <section className="py-10 bg-bali-cream">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Suspense fallback={
            <div className="space-y-6">
              <div className="h-72 bg-white rounded-2xl animate-pulse border border-bali-sand/30" />
              <div className="h-[700px] bg-white rounded-2xl animate-pulse border border-bali-sand/30" />
            </div>
          }>
            <FlightWidget departureDate={departureDate} />
          </Suspense>
        </div>
      </section>
    </PageTransition>
  );
}
