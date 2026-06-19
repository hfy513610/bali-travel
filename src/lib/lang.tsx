"use client";

import React from "react";
import { useSearchParams } from "next/navigation";

export type Lang = "zh" | "en";

/**
 * Get current lang from URL searchParams.
 * Falls back to "zh" if not present.
 */
export function useLang(): Lang {
  const sp = useSearchParams();
  const raw = sp.get("lang");
  return raw === "en" ? "en" : "zh";
}

/**
 * Build a URL with the current lang parameter appended.
 */
export function makeLangHref(href: string, lang: Lang): string {
  const sep = href.includes("?") ? "&" : "?";
  return href.includes("lang=") ? href : `${href}${sep}lang=${lang}`;
}
