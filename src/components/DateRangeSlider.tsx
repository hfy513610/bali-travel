"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface DateRangeSliderProps {
  min?: number;
  max?: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  className?: string;
}

export function DateRangeSlider({
  min = 1, max = 14, value, onChange, className,
}: DateRangeSliderProps) {
  const [localValue, setLocalValue] = useState(value);
  useEffect(() => { setLocalValue(value); }, [value]);

  const step = () => {
    if (localValue[0] > min) {
      const next: [number, number] = [localValue[0] - 1, localValue[1]];
      setLocalValue(next); onChange(next);
    }
  };
  const stepUp = () => {
    if (localValue[1] < max) {
      const next: [number, number] = [localValue[0], localValue[1] + 1];
      setLocalValue(next); onChange(next);
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <button onClick={step} disabled={localValue[0] <= min} className="p-2 rounded-full bg-bali-sand/30 hover:bg-bali-sand/50 disabled:opacity-30 transition-all">
          <Minus className="w-4 h-4 text-bali-charcoal" />
        </button>
        <motion.div key={`${localValue[0]}-${localValue[1]}`} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
          <span className="font-serif text-2xl font-bold text-bali-charcoal">{localValue[0]}</span>
          <span className="text-bali-charcoal/30 mx-1">—</span>
          <span className="font-serif text-2xl font-bold text-bali-charcoal">{localValue[1]}</span>
          <span className="block text-xs text-bali-charcoal/50 mt-1">旅行天数</span>
        </motion.div>
        <button onClick={stepUp} disabled={localValue[1] >= max} className="p-2 rounded-full bg-bali-sand/30 hover:bg-bali-sand/50 disabled:opacity-30 transition-all">
          <Plus className="w-4 h-4 text-bali-charcoal" />
        </button>
      </div>
      <div className="relative h-1.5 bg-bali-sand/50 rounded-full">
        <motion.div
          className="absolute h-full bg-bali-sunset rounded-full"
          animate={{
            left: `${((localValue[0] - min) / (max - min)) * 100}%`,
            right: `${100 - ((localValue[1] - min) / (max - min)) * 100}%`,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      </div>
    </div>
  );
}
