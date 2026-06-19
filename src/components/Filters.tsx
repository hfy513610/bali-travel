"use client";

import { motion } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type TourType = "all" | "culture" | "adventure" | "romance" | "wellness";
export type Difficulty = "all" | "easy" | "medium" | "hard";

export interface FilterState {
  type: TourType;
  difficulty: Difficulty;
  days: [number, number];
  priceRange: [number, number];
}

interface FiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onClose?: () => void;
}

const typeOptions: { value: TourType; label: string }[] = [
  { value: "all", label: "全部类型" },
  { value: "culture", label: "文化探索" },
  { value: "adventure", label: "海岛探险" },
  { value: "romance", label: "浪漫蜜月" },
  { value: "wellness", label: "静修疗愈" },
];

const difficultyOptions: { value: Difficulty; label: string }[] = [
  { value: "all", label: "全部难度" },
  { value: "easy", label: "轻松" },
  { value: "medium", label: "适中" },
  { value: "hard", label: "挑战" },
];

const dayRanges = [
  { value: [1, 3] as [number, number], label: "1-3天" },
  { value: [3, 5] as [number, number], label: "3-5天" },
  { value: [5, 7] as [number, number], label: "5-7天" },
  { value: [7, 14] as [number, number], label: "7天以上" },
];

export function Filters({ filters, onChange, onClose }: FiltersProps) {
  const set = <K extends keyof FilterState>(key: K, value: FilterState[K]) =>
    onChange({ ...filters, [key]: value });

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="bg-white rounded-2xl shadow-lg border border-bali-sand/40 p-6 space-y-6"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-lg flex items-center gap-2 text-bali-charcoal">
          <SlidersHorizontal className="w-4 h-4 text-bali-sunset" />
          筛选条件
        </h3>
        {onClose && (
          <button onClick={onClose} className="text-bali-charcoal/40 hover:text-bali-charcoal">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div>
        <label className="block text-xs uppercase tracking-wider text-bali-charcoal/50 mb-2">线路类型</label>
        <div className="flex flex-wrap gap-2">
          {typeOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => set("type", opt.value)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                filters.type === opt.value
                  ? "bg-bali-sunset text-white shadow-md shadow-bali-sunset/20"
                  : "bg-bali-sand/30 text-bali-charcoal/60 hover:bg-bali-sand/50"
              )}
            >{opt.label}</button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs uppercase tracking-wider text-bali-charcoal/50 mb-2">难度</label>
        <div className="flex flex-wrap gap-2">
          {difficultyOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => set("difficulty", opt.value)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                filters.difficulty === opt.value
                  ? "bg-bali-ocean text-white shadow-md shadow-bali-ocean/20"
                  : "bg-bali-sand/30 text-bali-charcoal/60 hover:bg-bali-sand/50"
              )}
            >{opt.label}</button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs uppercase tracking-wider text-bali-charcoal/50 mb-2">行程天数</label>
        <div className="flex flex-wrap gap-2">
          {dayRanges.map((opt) => (
            <button
              key={opt.label}
              onClick={() => set("days", opt.value)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                filters.days[0] === opt.value[0] && filters.days[1] === opt.value[1]
                  ? "bg-bali-jungle text-white shadow-md shadow-bali-jungle/20"
                  : "bg-bali-sand/30 text-bali-charcoal/60 hover:bg-bali-sand/50"
              )}
            >{opt.label}</button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs uppercase tracking-wider text-bali-charcoal/50 mb-2">预算范围</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={filters.priceRange[0]}
            onChange={(e) => set("priceRange", [Number(e.target.value), filters.priceRange[1]])}
            className="w-full px-3 py-2 rounded-lg border border-bali-sand/50 bg-bali-cream/50 text-sm focus:outline-none focus:border-bali-sunset"
            placeholder="最低"
          />
          <span className="text-bali-charcoal/30">—</span>
          <input
            type="number"
            value={filters.priceRange[1]}
            onChange={(e) => set("priceRange", [filters.priceRange[0], Number(e.target.value)])}
            className="w-full px-3 py-2 rounded-lg border border-bali-sand/50 bg-bali-cream/50 text-sm focus:outline-none focus:border-bali-sunset"
            placeholder="最高"
          />
        </div>
      </div>

      <button
        onClick={() => onChange({ type: "all", difficulty: "all", days: [0, 14], priceRange: [0, 50000] })}
        className="w-full py-2 text-xs text-bali-sunset hover:text-bali-sunset/80 font-medium transition-colors"
      >
        重置筛选
      </button>
    </motion.div>
  );
}
