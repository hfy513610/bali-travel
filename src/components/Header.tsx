"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Menu, X, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { useLang } from "@/lib/lang";

export function Header() {
  const pathname = usePathname();
  const sp = useSearchParams();
  const lang = useLang();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Helper: build href with lang preserved
  const l = (href: string) => {
    const sep = href.includes("?") ? "&" : "?";
    return `${href}${sep}lang=${lang}`;
  };

  const navLinks = [
    { href: "/", label: lang === "en" ? "Home" : "首页" },
    { href: "/tours", label: lang === "en" ? "Tours" : "探索线路" },
    { href: "/flights", label: lang === "en" ? "Flights" : "航班" },
    { href: "/builder", label: lang === "en" ? "Builder" : "行程构建器" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-bali-cream/90 backdrop-blur-md border-b border-bali-sand/50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href={l("/")} className="flex items-center gap-2 group">
          <MapPin className="w-6 h-6 text-bali-sunset group-hover:scale-110 transition-transform" />
          <span className="font-serif text-xl font-bold text-bali-charcoal">
            Bali<span className="text-bali-sunset">Journey</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={l(link.href)}
              className={cn(
                "relative text-sm font-medium transition-colors hover:text-bali-sunset",
                pathname === link.href ? "text-bali-sunset" : "text-bali-charcoal/70"
              )}
            >
              {link.label}
              {pathname === link.href && (
                <motion.div
                  layoutId="nav-underline"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-bali-sunset rounded-full"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </Link>
          ))}
          <LanguageSwitcher />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitcher />
          <button
            className="p-2 text-bali-charcoal"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden bg-bali-cream border-b border-bali-sand/50"
          >
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={l(link.href)}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "block py-2 text-sm font-medium transition-colors",
                    pathname === link.href ? "text-bali-sunset" : "text-bali-charcoal/70"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
