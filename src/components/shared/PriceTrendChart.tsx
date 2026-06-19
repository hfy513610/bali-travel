"use client";

import { useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from "recharts";
import { cn } from "@/lib/utils";

/* ─── mock trend data ─── */
function generate(dep?: string) {
  const base = dep ? new Date(dep) : new Date(Date.now() + 7 * 86400000);
  const out = [] as { day: string; price: number; isDeparture: boolean }[];
  for (let i = -3; i <= 3; i++) {
    const d = new Date(base);
    d.setDate(d.getDate() + i);
    const label = `${d.getMonth() + 1}/${d.getDate()}`;
    const basePrice = 2850;
    const noise = Math.round(Math.sin(i * 0.8) * 400 + (Math.random() - 0.5) * 300);
    out.push({ day: i === 0 ? `${label} ✈` : label, price: basePrice + noise, isDeparture: i === 0 });
  }
  return out;
}

interface Props {
  from?: string;
  to?: string;
  departureDate?: string;
  className?: string;
}

export function PriceTrendChart({ from = "CKG", to = "DPS", departureDate, className }: Props) {
  const trend = useMemo(() => generate(departureDate), [departureDate]);
  const dateStr = departureDate
    ? new Date(departureDate).toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" })
    : "";

  return (
    <div className={cn(className)}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-serif text-lg font-bold text-bali-charcoal flex items-center gap-2">
          <TrendSvg className="w-5 h-5 text-bali-sunset" />
          {from} → {to} 近7天价格趋势
        </h3>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-bali-sand/40 text-bali-charcoal/50">基于历史预测</span>
      </div>
      <p className="text-sm text-bali-charcoal/40 mb-1">
        出发日期：{dateStr}
        <CalSvg className="inline w-3.5 h-3.5 ml-1.5 text-bali-sunset" />
      </p>

      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={trend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F5E6D3" />
          <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#8B5E3C" }} />
          <YAxis domain={["dataMin - 200", "dataMax + 200"]} tick={{ fontSize: 12, fill: "#8B5E3C" }} tickFormatter={(v: number) => `¥${v}`} />
          <Tooltip formatter={(v: number) => [`¥${v}`, "预估价格"]}
            contentStyle={{ borderRadius: 12, border: "1px solid #F5E6D3", fontSize: 13 }} />
          <ReferenceLine x={trend[3]?.day ?? ""} stroke="#E07A5F" strokeDasharray="4 4"
            label={{ value: "出发日", position: "top", fill: "#E07A5F", fontSize: 11 }} />
          <Line type="monotone" dataKey="price" stroke="#E07A5F" strokeWidth={2.5}
            dot={(p: { cx: number; cy: number; payload: { isDeparture: boolean } }) => (
              <circle cx={p.cx} cy={p.cy} r={p.payload.isDeparture ? 6 : 3}
                fill={p.payload.isDeparture ? "#E07A5F" : "#C9A96E"} stroke="#fff" strokeWidth={2} />
            )}
            activeDot={{ r: 7, fill: "#E07A5F" }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function TrendSvg({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

function CalSvg({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}
