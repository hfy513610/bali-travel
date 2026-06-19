"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Compass, Heart, MapPin, Shield, Plane } from "lucide-react";
import dynamic from "next/dynamic";
import { useState, useCallback } from "react";
import { PageTransition } from "@/components/PageTransition";
import { WeatherRecommendation } from "@/components/recommendation/WeatherRecommendation";
import { getDestinations } from "@/lib/data";
import type { Destination } from "@/lib/data";
import { useLang } from "@/lib/lang";

const WeatherMini = dynamic(
  () => import("@/components/weather/WeatherCard").then((m) => m.WeatherMini),
  { ssr: false }
);

const destinations = getDestinations();

export default function HomePage() {
  const lang = useLang();
  const [weatherMain, setWeatherMain] = useState<string>();
  const [weatherDesc, setWeatherDesc] = useState<string>("多云");

  const handleWeatherLoaded = useCallback((main: string, desc?: string) => {
    setWeatherMain(main);
    if (desc) setWeatherDesc(desc);
  }, []);

  const l = (href: string) => {
    const sep = href.includes("?") ? "&" : "?";
    return `${href}${sep}lang=${lang}`;
  };

  return (
    <PageTransition>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url(https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1920&q=80)" }} />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-white" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex flex-col lg:flex-row items-start gap-10">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="max-w-2xl flex-1"
            >
              <motion.span initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white/90 text-sm mb-6 border border-white/20">
                {lang === "en" ? "Explore the Island of Gods" : "探索众神之岛"}
              </motion.span>
              <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-tight text-shadow-soft">
                {lang === "en" ? "Discover Your" : "发现你的"}<br />
                <span className="text-bali-gold">{lang === "en" ? "Bali Story" : "巴厘故事"}</span>
              </h1>
              <p className="mt-6 text-lg text-white leading-relaxed max-w-lg">
                {lang === "en"
                  ? "From Ubud's morning mist to Uluwatu's cliff sunsets — carefully curated journeys into the soul of Bali."
                  : "从乌布梯田的晨雾到乌鲁瓦图的悬崖落日，精心策划的旅行体验带你深入巴厘岛的灵魂。"}
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href={l("/tours")}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-bali-sunset text-white rounded-full font-medium hover:bg-bali-sunset/90 transition-colors shadow-lg shadow-bali-sunset/20">
                  {lang === "en" ? "Explore Tours" : "探索线路"} <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href={l("/builder")}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-bali-sand/30 rounded-full font-medium hover:bg-bali-sand/20 transition-colors shadow-sm"
                  style={{ color: "#293241" }}>
                  {lang === "en" ? "Customize" : "定制行程"} <Compass className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.6 }}
              className="hidden lg:block flex-shrink-0 mt-6 lg:mt-16">
              <WeatherMini defaultRegion="denpasar" onWeatherLoaded={(main, desc) => { setWeatherMain(main); if (desc) setWeatherDesc(desc); }} />
            </motion.div>
          </div>
        </div>

        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-bali-charcoal/30 text-sm flex flex-col items-center gap-2">
          <span className="font-serif text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-5 h-8 rounded-full border-2 border-bali-charcoal/15 flex justify-center">
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-1 h-1.5 rounded-full bg-bali-sunset mt-1.5" />
          </div>
        </motion.div>
      </section>

      <WeatherRecommendation weatherMain={weatherMain} className="bg-white" />

      <section className="py-24 bg-bali-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-bali-charcoal">
              {lang === "en" ? "Why Choose " : "为什么选择 "}
              <span className="text-bali-sunset">BaliJourney</span>
            </h2>
            <p className="mt-3 text-bali-charcoal/50 max-w-md mx-auto">
              {lang === "en" ? "Curated journeys, local expertise, worry-free travel" : "精心策划、本地视角、全程无忧"}
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Compass, titleZh: "深度策划", titleEn: "Expertly Curated", descZh: "由巴厘本地向导精心设计，不走马观花，只走心。", descEn: "Designed by local guides — no surface-level tourism, only authentic experiences." },
              { icon: Shield, titleZh: "全程无忧", titleEn: "Worry-Free", descZh: "包车、住宿、门票一站搞定，你只管享受旅程。", descEn: "Transport, hotels, tickets all sorted — you just enjoy the journey." },
              { icon: Heart, titleZh: "专属体验", titleEn: "Personalized", descZh: "支持个性化定制，让每段旅途都独一无二。", descEn: "Customizable trips that make every journey one-of-a-kind." },
            ].map((feat, i) => (
              <motion.div key={feat.titleZh} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }} transition={{ delay: i * 0.1, duration: 0.5 }}
                className="text-center p-8 rounded-2xl bg-white/60 border border-bali-sand/30 hover:bg-white hover:shadow-lg transition-all">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-bali-sunset/10 text-bali-sunset mb-5">
                  <feat.icon className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-bali-charcoal mb-2">
                  {lang === "en" ? feat.titleEn : feat.titleZh}
                </h3>
                <p className="text-sm text-bali-charcoal/50 leading-relaxed">
                  {lang === "en" ? feat.descEn : feat.descZh}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-bali-charcoal">
              {lang === "en" ? "Popular Destin" : "热门目的"}<span className="text-bali-sunset">{lang === "en" ? "ations" : "地"}</span>
            </h2>
            <p className="mt-3 text-bali-charcoal/50">{lang === "en" ? "Bali's most unmissable places" : "精选巴厘岛最值得探索的地方"}</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {destinations.slice(0, 8).map((dest: Destination, i: number) => (
              <motion.div key={dest.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.5 }}
                className="group relative aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer">
                <div className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                  style={{ backgroundImage: `url(${dest.image})` }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent group-hover:from-black/80 transition-colors" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="font-serif text-lg font-bold text-white">{dest.name}</h3>
                  <p className="text-white/70 text-xs mt-0.5">{dest.nameEn}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <MapPin className="w-3 h-3 text-bali-sunset" />
                    <span className="text-white/60 text-xs">{dest.region}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href={l("/tours")} className="inline-flex items-center gap-2 text-bali-ocean hover:text-bali-sunset font-medium transition-colors">
              {lang === "en" ? "View All Destinations" : "查看全部目的地"} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 bg-bali-sunset">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-4">
              {lang === "en" ? "Start Building Your Bali Trip" : "开始构建你的巴厘之行"}
            </h2>
            <p className="text-white/80 max-w-md mx-auto mb-8">
              {lang === "en" ? "Choose destinations and preferences — we craft the perfect journey." : "选择目的地和偏好，让我们为你量身打造完美旅程"}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href={l("/builder")}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-bali-sunset rounded-full font-medium hover:bg-bali-cream transition-colors shadow-lg">
                {lang === "en" ? "Start Customizing" : "开始定制"} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href={l("/flights")}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-full font-medium hover:bg-white/20 transition-colors shadow-lg">
                <Plane className="w-4 h-4" /> {lang === "en" ? "View Flights" : "查看航班"}
              </Link>
              <Link href={l("/tours")}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-full font-medium hover:bg-white/20 transition-colors shadow-lg">
                <Compass className="w-4 h-4" /> {lang === "en" ? "Explore Tours" : "探索线路"}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </PageTransition>
  );
}
