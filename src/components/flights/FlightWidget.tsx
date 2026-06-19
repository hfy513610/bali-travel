"use client";

import { useState, Suspense } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { Plane, ExternalLink, CalendarDays } from "lucide-react";
import { cn, isoDate } from "@/lib/utils";

// Lazy-load recharts to avoid blocking first paint
const PriceTrendChart = dynamic(
  () => import("../shared/PriceTrendChart").then((m) => m.PriceTrendChart),
  { ssr: false }
);

/* ─── component ─── */

interface FlightWidgetProps {
  from?: string;
  to?: string;
  departureDate?: string;  // YYYY-MM-DD, synced from builder
  className?: string;
}

export default function FlightWidget({
  from = "CKG",
  to = "DPS",
  departureDate,
  className,
}: FlightWidgetProps) {
  const defaultDate = departureDate ?? isoDate(new Date(Date.now() + 7 * 86400000));
  const [departDate, setDepartDate] = useState(defaultDate);

  // Ctrip deep-link with prefilled params
  const ctripUrl = `https://flights.ctrip.com/online/list/oneway-${from.toLowerCase()}-${to.toLowerCase()}?depdate=${departDate}`;

  const display = new Date(departDate).toLocaleDateString("zh-CN", {
    year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div className={cn("space-y-8", className)}>
      {/* ── glassmorphism search card ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-white/20 shadow-xl backdrop-blur-xl bg-white/10 p-6">
        <div className="absolute inset-0 bg-gradient-to-br from-bali-sunset/30 via-bali-sand/20 to-bali-ocean/20" />

        <div className="relative z-10 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
              <Plane className="w-5 h-5" /> {from} → {to} 航班
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white/70 backdrop-blur-sm">实时查询</span>
          </div>

          {/* date picker + CTA */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-white/70" />
              <input
                type="date"
                value={departDate}
                onChange={(e) => setDepartDate(e.target.value)}
                className="px-3 py-2 rounded-lg bg-white/20 backdrop-blur-sm text-white border border-white/30
                           focus:outline-none focus:ring-2 focus:ring-bali-sunset text-sm"
              />
            </div>
            <a
              href={ctripUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2 bg-bali-sunset hover:bg-bali-sunset/90 text-white
                         rounded-full font-medium transition-colors shadow-lg shadow-bali-sunset/20 text-sm"
            >
              查询航班 <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* info pills */}
          <div className="flex flex-wrap gap-3 text-sm text-white/80">
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm">✈ {from} → {to}</span>
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm">📅 {display}</span>
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm">👤 1人 · 经济舱</span>
          </div>

          {/* Ctrip iframe */}
          <div className="w-full h-[420px] rounded-xl overflow-hidden border border-white/20 bg-white/5">
            <iframe
              src="https://flights.ctrip.com/"
              className="w-full h-full"
              title="航班搜索 — 携程"
              loading="lazy"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
          </div>
        </div>
      </motion.div>

      {/* ── price trend chart ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-bali-sand/30">
        <Suspense fallback={
          <div className="h-[280px] bg-bali-sand/10 rounded-xl animate-pulse flex items-center justify-center">
            <p className="text-sm text-bali-charcoal/30">加载价格趋势...</p>
          </div>
        }>
          <PriceTrendChart from={from} to={to} departureDate={departDate} />
          <p className="text-bali-charcoal/30 text-xs mt-3 text-center">
            * 近7天价格趋势（基于历史数据模拟，仅供参考）
          </p>
        </Suspense>
      </motion.div>
    </div>
  );
}
