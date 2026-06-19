"use client";

import { motion } from "framer-motion";
import {
  Sun, Moon, Cloud, CloudSun, CloudMoon, CloudRain,
  CloudDrizzle, CloudLightning, CloudFog, Cloudy,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { weatherIconName } from "@/lib/weather-utils";

// OWM icon code → Lucide icon
const iconMap: Record<string, LucideIcon> = {
  sun: Sun, moon: Moon,
  cloud: Cloud, clouds: Cloudy,
  "cloud-sun": CloudSun, "cloud-moon": CloudMoon,
  "cloud-rain": CloudRain, "cloud-drizzle": CloudDrizzle,
  "cloud-lightning": CloudLightning, "cloud-fog": CloudFog,
};
const fallback = CloudSun;

interface WeatherIconProps {
  code: string;
  size?: "sm" | "md" | "lg";
  daytime?: boolean;
  className?: string;
}

const sizeMap = { sm: "w-8 h-8", md: "w-12 h-12", lg: "w-16 h-16" };

export function WeatherIcon({ code, size = "md", daytime = true, className }: WeatherIconProps) {
  const Icon = iconMap[weatherIconName(code)] ?? fallback;

  return (
    <motion.div
      key={code}
      initial={{ scale: 0.4, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className="relative inline-flex"
    >
      <Icon
        className={cn(
          sizeMap[size],
          daytime ? "text-amber-400 drop-shadow-sm" : "text-indigo-300 drop-shadow-sm",
          className
        )}
      />
    </motion.div>
  );
}
