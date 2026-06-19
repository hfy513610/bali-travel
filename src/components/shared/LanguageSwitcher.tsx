"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

const labels: Record<string, string> = { zh: "EN", en: "中" };

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [transitioning, setTransitioning] = useState(false);

  const currentLang = searchParams.get("lang") === "en" ? "en" : "zh";
  const nextLang = currentLang === "zh" ? "en" : "zh";

  const handleSwitch = () => {
    setTransitioning(true);
    // Build new URL with ?lang= parameter
    const params = new URLSearchParams(searchParams.toString());
    params.set("lang", nextLang);
    router.push(`${pathname}?${params.toString()}`);
    setTimeout(() => setTransitioning(false), 400);
  };

  return (
    <button
      onClick={handleSwitch}
      disabled={transitioning}
      className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full
                 text-xs font-medium transition-all duration-300
                 bg-bali-sand/30 hover:bg-bali-sand/50
                 text-bali-charcoal/60 hover:text-bali-charcoal
                 border border-bali-sand/20
                 disabled:opacity-60"
      aria-label="Switch language"
    >
      {transitioning ? (
        <motion.span
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-1"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 0.6, ease: "linear" }}
            className="w-3 h-3 border border-current border-t-transparent rounded-full"
          />
        </motion.span>
      ) : (
        <motion.span
          key={currentLang}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {labels[currentLang]}
        </motion.span>
      )}
    </button>
  );
}
