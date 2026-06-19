import Link from "next/link";
import { MapPin, Mail, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-bali-charcoal text-bali-cream/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-bali-sunset" />
              <span className="font-serif text-lg font-bold text-bali-cream">
                Bali<span className="text-bali-sunset">Journey</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-bali-cream/60">
              精心策划的巴厘岛旅行体验，从文化探索到海岛冒险，为你打造独一无二的岛屿记忆。
            </p>
          </div>

          <div>
            <h4 className="font-serif text-bali-cream mb-4">快速导航</h4>
            <div className="space-y-2 text-sm">
              <Link href="/tours" className="block hover:text-bali-sunset transition-colors">
                探索线路
              </Link>
              <Link href="/builder" className="block hover:text-bali-sunset transition-colors">
                行程构建器
              </Link>
              <Link href="#" className="block hover:text-bali-sunset transition-colors">
                关于我们
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-serif text-bali-cream mb-4">联系我们</h4>
            <div className="space-y-2 text-sm text-bali-cream/60">
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                hello@balijourney.com
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                巴厘岛 · 印度尼西亚
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-bali-cream/10 text-center text-sm text-bali-cream/40">
          <p className="flex items-center justify-center gap-1">
            Made with <Heart className="w-3 h-3 text-bali-sunset" /> in Bali · {new Date().getFullYear()} BaliJourney
          </p>
        </div>
      </div>
    </footer>
  );
}
