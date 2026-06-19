import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Bali Journey — 探索巴厘岛之美",
    template: "%s | Bali Journey",
  },
  description:
    "探索巴厘岛最精品的旅游线路，从文化深度之旅到海岛探险，定制你的完美巴厘假期。",
  keywords: ["巴厘岛", "旅游", "线路", "定制", "文化", "海岛"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className={`${inter.variable} ${playfairDisplay.variable}`}>
      <body className="min-h-screen flex flex-col">
        <Providers>
          <Suspense fallback={<HeaderFallback />}>
            <Header />
          </Suspense>
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

function HeaderFallback() {
  return (
    <header className="sticky top-0 z-50 bg-bali-cream/90 backdrop-blur-md border-b border-bali-sand/50 h-16" />
  );
}
