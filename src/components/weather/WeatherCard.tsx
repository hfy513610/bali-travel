"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Droplets, Wind, CloudRain } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WeatherData } from "@/types/weather";
import { useLang } from "@/lib/lang";
import { WeatherIcon } from "./WeatherIcon";
import { WeatherRegionSelector } from "./WeatherRegionSelector";

/* ─── sunrise/sunset inline SVG ─── */
function SunClock({ ts, label }: { ts: number; label: string }) {
  const time = new Date(ts * 1000).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false });
  return (
    <span className="flex items-center gap-1 text-xs opacity-60">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
        <path d="M12 2v4" /><path d="M12 10v4" /><path d="M12 18v2" />
        <path d="M4.93 10.93l1.41 1.41" /><path d="M17.66 10.93l-1.41 1.41" />
        <path d="M2 18h20" /><path d="M20 18a8 8 0 1 0-16 0" />
      </svg>
      {label} {time}
    </span>
  );
}

/* ─── full card ─── */

interface WeatherCardProps {
  className?: string;
  defaultRegion?: string;
  onRegionChange?: (regionId: string) => void;
  onWeatherLoaded?: (weatherMain: string) => void;
}

export function WeatherCard({
  className,
  defaultRegion = "denpasar",
  onRegionChange,
  onWeatherLoaded,
}: WeatherCardProps) {
  const lang = useLang();
  const [regionId, setRegionId] = useState(defaultRegion);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  // Fetch when region or lang changes (lang change triggers page re-render via URL)
  const fetch = useCallback(async (rid: string, l: string) => {
    setLoading(true);
    try {
      const res = await globalThis.fetch(`/api/weather?region=${rid}&lang=${l}`);
      if (res.ok) {
        const data = await res.json();
        setWeather(data);
        if (data?.icon) onWeatherLoaded?.(mapIconToMain(data.icon));
      }
    } catch { /* keep last state */ }
    finally { setLoading(false); }
  }, [onWeatherLoaded]);

  useEffect(() => {
    const l = lang === "en" ? "en" : "zh_cn";
    fetch(regionId, l);
  }, [regionId, lang, fetch]);

  const day = weather ? weather.dt < weather.sunset && weather.dt > weather.sunrise : true;
  const clr = day ? "#293241" : "#f0f0f0";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={cn(
        "relative overflow-hidden rounded-2xl p-5",
        "bg-white/10 backdrop-blur-md",
        "border border-white/20 shadow-xl",
        "transition-all",
        className
      )}
    >
      <div
        className={cn(
          "absolute inset-0 -z-10 transition-colors duration-1000",
          day ? "bg-gradient-to-br from-amber-400/20 via-rose-400/10 to-sky-400/20 animate-gradient-slow"
              : "bg-gradient-to-br from-indigo-900/40 via-purple-900/30 to-blue-900/40 animate-gradient-slow"
        )}
        style={{ backgroundSize: "200% 200%" }}
      />

      <div className="relative z-10 space-y-4">
        <div className="flex items-center justify-between">
          <WeatherRegionSelector
            regionId={regionId}
            onSelect={(id) => { setRegionId(id); onRegionChange?.(id); }}
            open={open}
            onToggle={() => setOpen((o) => !o)}
            textColor={clr}
          />
          <span className="text-[10px] uppercase tracking-wider opacity-50" style={{ color: clr }}>
            {loading ? (lang === "en" ? "Loading..." : "加载中...") : (lang === "en" ? "Live" : "实时")}
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center py-6">
            <motion.div animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="w-7 h-7 border-2 border-bali-sunset/30 border-t-bali-sunset rounded-full" />
          </div>
        ) : weather ? (
          <>
            <div className="flex items-center justify-between">
              <div>
                <motion.span key={weather.temp} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                  className="font-serif text-4xl font-light" style={{ color: clr }}>{weather.temp}</motion.span>
                <span className="font-serif text-2xl opacity-50" style={{ color: clr }}>°C</span>
                <p className="text-xs opacity-50 capitalize mt-1" style={{ color: clr }}>{weather.description}</p>
              </div>
              <WeatherIcon code={weather.icon} size="lg" daytime={day} />
            </div>
            <div className="flex gap-4 text-sm" style={{ color: clr }}>
              <span className="flex items-center gap-1 opacity-80"><Droplets className="w-4 h-4 text-bali-ocean/60" />{weather.humidity}%</span>
              <span className="flex items-center gap-1 opacity-80"><Wind className="w-4 h-4 text-bali-ocean/60" />{weather.windSpeed}m/s</span>
              <span className="flex items-center gap-1 opacity-80"><CloudRain className="w-4 h-4 text-bali-ocean/60" />{weather.precipitation}%</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-white/20">
              <SunClock ts={weather.sunrise} label={lang === "en" ? "Sunrise" : "日出"} />
              <SunClock ts={weather.sunset} label={lang === "en" ? "Sunset" : "日落"} />
            </div>
          </>
        ) : (
          <p className="text-center py-6 text-sm opacity-40" style={{ color: clr }}>
            {lang === "en" ? "Weather unavailable" : "天气数据暂时不可用"}
          </p>
        )}
      </div>
    </motion.div>
  );
}

/* ─── hero mini variant ─── */

interface WeatherMiniProps { className?: string; defaultRegion?: string; onWeatherLoaded?: (weatherMain: string, weatherDesc?: string) => void; }

export function WeatherMini({ className, defaultRegion = "denpasar", onWeatherLoaded }: WeatherMiniProps) {
  const lang = useLang();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const l = lang === "en" ? "en" : "zh_cn";
    globalThis.fetch(`/api/weather?region=${defaultRegion}&lang=${l}`)
      .then((r) => r.ok && r.json())
      .then((d) => {
        if (d) {
          setWeather(d);
          if (d.icon) onWeatherLoaded?.(mapIconToMain(d.icon), d.description);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [defaultRegion, lang, onWeatherLoaded]);

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
      className={cn("flex items-center gap-3 px-4 py-3 rounded-2xl backdrop-blur-xl border border-white/20 bg-white/10 text-white", className)}>
      {loading ? (
        <div className="flex items-center gap-2 text-white/60 text-sm">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full" />
          {lang === "en" ? "Loading..." : "加载..."}
        </div>
      ) : weather ? (
        <>
          <WeatherIcon code={weather.icon} size="sm" daytime />
          <div>
            <span className="font-serif text-2xl font-bold">{weather.temp}°</span>
            <span className="text-white/60 text-xs ml-1">{weather.description}</span>
          </div>
        </>
      ) : null}
    </motion.div>
  );
}

/* ─── helper ─── */
function mapIconToMain(icon: string): string {
  const id = parseInt(icon.slice(0, 2));
  if (id >= 1 && id <= 3) return "Clear";
  if (id >= 4 && id <= 6) return "Clouds";
  if (id >= 9 && id <= 11) return "Rain";
  if (id === 13) return "Snow";
  if (id >= 50 && id <= 52) return icon === "50d" ? "Mist" : "Fog";
  return "Clouds";
}
