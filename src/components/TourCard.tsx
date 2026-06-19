"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Star, CalendarDays, MapPin, ArrowRight } from "lucide-react";
import type { Tour } from "@/lib/data";
import { formatPrice } from "@/lib/utils";

interface TourCardProps {
  tour: Tour;
  index?: number;
}

const typeLabels: Record<string, string> = {
  culture: "文化探索",
  adventure: "海岛探险",
  romance: "浪漫蜜月",
  wellness: "静修疗愈",
};

export function TourCard({ tour, index = 0 }: TourCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow border border-bali-sand/40"
    >
      <div className="relative h-52 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
          style={{ backgroundImage: `url(${tour.coverImage})` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-white/90 text-bali-charcoal backdrop-blur-sm">
            {typeLabels[tour.type]}
          </span>
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <h3 className="font-serif text-xl font-bold text-white text-shadow-soft">{tour.title}</h3>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <p className="text-sm text-bali-charcoal/60 line-clamp-2 leading-relaxed">{tour.subtitle}</p>
        <div className="flex items-center gap-3 text-xs text-bali-charcoal/50">
          <span className="flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5" />{tour.days}天</span>
          <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{tour.itinerary.length}个目的地</span>
          <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-bali-gold" fill="#C9A96E" />{tour.rating}</span>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-bali-sand/30">
          <div>
            <span className="text-lg font-bold text-bali-sunset">{formatPrice(tour.price)}</span>
            <span className="text-xs text-bali-charcoal/40"> /人</span>
          </div>
          <Link href={`/tours/${tour.slug}`}
            className="flex items-center gap-1 text-sm font-medium text-bali-ocean hover:text-bali-sunset transition-colors group/link">
            查看详情 <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
