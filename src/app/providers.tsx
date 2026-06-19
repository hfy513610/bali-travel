"use client";

import { ThemeProvider } from "next-themes";

// Language is now URL-based (?lang=zh or ?lang=en).
// No LanguageProvider needed — components read lang from useSearchParams() directly.

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      {children}
    </ThemeProvider>
  );
}
