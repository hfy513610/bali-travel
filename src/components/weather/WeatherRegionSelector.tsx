"use client";

import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { BALI_REGIONS_CLIENT } from "@/lib/weather-utils";

function Pin({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

interface Props {
  regionId: string;
  onSelect: (id: string) => void;
  open: boolean;
  onToggle: () => void;
  textColor?: string;
}

export function WeatherRegionSelector({ regionId, onSelect, open, onToggle, textColor = "#293241" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const region = BALI_REGIONS_CLIENT.find((r) => r.id === regionId) ?? BALI_REGIONS_CLIENT[0];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center gap-1.5 text-sm font-medium hover:opacity-80 transition-opacity"
        style={{ color: textColor }}
      >
        <Pin className="w-3.5 h-3.5 text-bali-sunset" />
        {region.name}
        <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", open && "rotate-180")} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            className="absolute top-full left-0 mt-1 w-36 bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-bali-sand/30 z-50 overflow-hidden"
          >
            {BALI_REGIONS_CLIENT.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => { onSelect(r.id); onToggle(); }}
                className={cn(
                  "w-full text-left px-3 py-2 text-sm hover:bg-bali-sand/20 transition-colors",
                  r.id === regionId ? "text-bali-sunset font-medium" : "text-bali-charcoal/70"
                )}
              >
                {r.name}
                <span className="text-xs text-bali-charcoal/30 ml-1">{r.nameEn}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
