"use client";
import React, { useMemo } from "react";
import type { TemplateProps } from "./types";
import type { Item, Time } from "@/types/items";
import {
  getZmanimForLocation,
  getCandleLightingForLocation,
  getDailyLearningDafYomi,
} from "@/services/hebcal.service";
import { formatTime, generateFiveMinutes } from "@/utils/utils";
import type { KehilaLocation } from "@/types/kehila";

function calcTime(time: Time, location: KehilaLocation): string {
  if (!time.dynamic) return time.val;
  const z = getZmanimForLocation(location);
  const round = time.roundToFiveMinutes || time.rond5minet;
  switch (time.zman) {
    case "shkiah": {
      const t = round ? generateFiveMinutes(z.shkiah(), time.nimus || "0") : formatTime(z.shkiah(), time.nimus || "0");
      return time.val ? `${time.val}: ${t}` : t;
    }
    case "CandleLightingTime": {
      const t = formatTime(getCandleLightingForLocation(location), time.nimus || "0");
      return time.val ? `${time.val}: ${t}` : t;
    }
    case "getDailyLearningDafYomi":
      return getDailyLearningDafYomi();
    default:
      return time.val;
  }
}

// ─── Card ─────────────────────────────────────────────────────────────────────

const ModernCard: React.FC<{
  item: Item;
  location: KehilaLocation;
  color: string;
  onEdit?: (item: Item) => void;
  isKiosk?: boolean;
}> = ({ item, location, color, onEdit, isKiosk }) => {
  const times = useMemo(
    () => item.times.map((t) => ({ ...t, computed: calcTime(t, location) })),
    [item, location]
  );

  return (
    <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow mb-3 overflow-hidden border border-gray-100">
      {/* Left accent bar */}
      <div className="absolute top-0 right-0 bottom-0 w-1 rounded-r-2xl" style={{ backgroundColor: color }} />

      {/* Title */}
      <div className="px-4 pt-3 pb-1 pr-5">
        <h3 className="font-bold text-base sm:text-lg text-gray-800">{item.title}</h3>
      </div>

      {/* Times */}
      <div className="px-4 pb-3 pr-5">
        {times.map((time, i) => (
          <div key={i} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0 gap-2">
            {time.name && (
              <span className="text-gray-400 text-xs sm:text-sm shrink-0">{time.name}</span>
            )}
            <span
              className="font-bold tabular-nums text-base sm:text-xl mr-auto py-0.5 px-2.5 rounded-lg text-white text-sm sm:text-base"
              style={{ backgroundColor: color }}
            >
              {time.computed}
            </span>
          </div>
        ))}
        {item.description && (
          <p className="text-gray-400 text-xs sm:text-sm mt-2 leading-relaxed">{item.description}</p>
        )}
      </div>

      {/* Edit */}
      {!isKiosk && onEdit && (
        <button
          aria-label="ערוך"
          onClick={() => onEdit(item)}
          className="absolute top-2.5 left-2.5 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-3.5 text-gray-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" />
          </svg>
        </button>
      )}
    </div>
  );
};

// ─── Zmanim footer ────────────────────────────────────────────────────────────

const ZMANIM_ITEMS = [
  { key: "sunrise",       label: "זריחה",          icon: "🌅" },
  { key: "sofZmanShma",   label: 'סוף ק"ש',        icon: "📿" },
  { key: "chatzot",       label: "חצות",            icon: "☀️" },
  { key: "minchaGedola",  label: "מנחה גדולה",      icon: "🕑" },
  { key: "shkiah",        label: "שקיעה",           icon: "🌇" },
  { key: "candleLighting",label: "הדלקת נרות",      icon: "🕯️" },
  { key: "shabbatEnd",    label: "צאת שבת",         icon: "✨" },
] as const;

// ─── Template ─────────────────────────────────────────────────────────────────

const COL_META = [
  { label: "יום חול", icon: "🌅" },
  { label: "שבת קודש", icon: "✡️" },
  { label: "שיעורים", icon: "📖" },
];

export const ModernTemplate: React.FC<TemplateProps> = ({
  kehila, itemsRight, itemsMiddle, itemsLeft,
  announcements, zmanim, isKiosk = false, onEdit,
}) => {
  const color = kehila.primaryColor || "#1e40af";
  const cols = [
    { ...COL_META[0], items: itemsRight },
    { ...COL_META[1], items: itemsMiddle },
    { ...COL_META[2], items: itemsLeft },
  ];
  const active = announcements.filter((a) => !a.expiresAt || new Date(a.expiresAt) > new Date());

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden" dir="rtl">

      {/* ── Header ── */}
      <header
        className="relative overflow-hidden text-white px-4 sm:px-8 pt-5 pb-8"
        style={{ background: `linear-gradient(135deg, ${color}ee, ${color}bb)` }}
      >
        {/* Decorative circles */}
        <div className="absolute -top-8 -left-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute top-2 left-24 w-16 h-16 rounded-full bg-white/5 pointer-events-none" />

        <div className="relative max-w-6xl mx-auto flex items-start justify-between gap-4 flex-wrap">
          {/* Name + city */}
          <div className="flex items-center gap-3">
            {kehila.logoUrl ? (
              <img src={kehila.logoUrl} alt="לוגו" className="h-12 w-12 rounded-2xl object-cover shadow-lg border-2 border-white/30" />
            ) : (
              <div className="h-12 w-12 rounded-2xl flex items-center justify-center text-2xl bg-white/20 shadow-lg border border-white/30">
                🕍
              </div>
            )}
            <div>
              <h1 className="font-bold text-xl sm:text-2xl lg:text-3xl leading-tight">{kehila.name}</h1>
              <p className="text-white/70 text-sm mt-0.5 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3.5 shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
                {kehila.city}
              </p>
            </div>
          </div>

          {/* Date + parasha */}
          <div className="text-left flex flex-col gap-1">
            <span className="font-semibold text-sm sm:text-base">{zmanim.hebrewDate}</span>
            {zmanim.parasha && (
              <span className="text-xs sm:text-sm bg-white/20 border border-white/30 px-2.5 py-0.5 rounded-full self-start">
                {zmanim.parasha}
              </span>
            )}
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0 h-4 overflow-hidden">
          <svg viewBox="0 0 1200 20" className="w-full h-full" preserveAspectRatio="none">
            <path d="M0,10 C300,20 600,0 900,10 C1050,15 1150,5 1200,10 L1200,20 L0,20 Z" fill="#f9fafb" />
          </svg>
        </div>
      </header>

      {/* ── Announcements ── */}
      {active.length > 0 && (
        <div className="max-w-6xl mx-auto w-full px-4 sm:px-8 pt-4 flex flex-col gap-2">
          {active.map((a) => (
            <div
              key={a.id}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-medium border shadow-xs ${
                a.type === "simcha" ? "bg-amber-50 border-amber-200 text-amber-800" :
                a.type === "avel"   ? "bg-slate-100 border-slate-200 text-slate-700" :
                                      "bg-sky-50 border-sky-200 text-sky-800"
              }`}
            >
              <span className="text-base shrink-0">{a.type === "simcha" ? "🎊" : a.type === "avel" ? "🕯️" : "📢"}</span>
              <span>{a.text}</span>
            </div>
          ))}
        </div>
      )}

      {/* ── Columns ── */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-8 py-4 overflow-hidden">
        <div className="flex lg:grid lg:grid-cols-3 overflow-x-auto snap-x snap-mandatory gap-4 pb-2 lg:overflow-hidden h-full">
          {cols.map((col, ci) => (
            <div
              key={ci}
              className="min-w-[88vw] sm:min-w-[58vw] lg:min-w-0 snap-start flex-shrink-0 lg:flex-shrink"
            >
              {/* Column header */}
              <div className="flex items-center gap-2 mb-3 pb-2 border-b-2" style={{ borderColor: color }}>
                <span className="text-lg">{col.icon}</span>
                <h2 className="font-bold text-base sm:text-lg text-gray-700">{col.label}</h2>
              </div>

              {col.items.sort((a, b) => a.index - b.index).map((item) => (
                <ModernCard key={item._id} item={item} location={kehila.location} color={color} onEdit={onEdit} isKiosk={isKiosk} />
              ))}
            </div>
          ))}
        </div>
      </main>

      {/* ── Zmanim footer ── */}
      <footer className="bg-white border-t border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-3 sm:py-4">
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-3">
            {ZMANIM_ITEMS.map(({ key, label, icon }) => (
              <div key={key} className="text-center group">
                <div className="text-base sm:text-lg">{icon}</div>
                <div
                  className="font-bold text-sm sm:text-base lg:text-lg tabular-nums mt-0.5"
                  style={{ color }}
                >
                  {zmanim[key]}
                </div>
                <div className="text-gray-400 text-[10px] sm:text-xs mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};
