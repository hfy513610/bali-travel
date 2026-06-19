import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-bali-cream">
      <div className="text-center px-4">
        <p className="font-serif text-8xl font-bold text-bali-sand mb-4">404</p>
        <h1 className="font-serif text-2xl font-bold text-bali-charcoal mb-2">
          页面未找到
        </h1>
        <p className="text-bali-charcoal/50 mb-8 max-w-sm mx-auto">
          你寻找的页面可能已经搬家，或从未存在于巴厘岛的地图上。
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-bali-sunset text-white rounded-full font-medium hover:bg-bali-sunset/90 transition-colors shadow-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          返回首页
        </Link>
      </div>
    </div>
  );
}
