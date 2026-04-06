"use client";
import React, { useMemo } from "react";
import type { TemplateProps } from "./types";
import type { Item } from "@/types/items";
import { calcTime } from "./calcTime";
import type { KehilaLocation } from "@/types/kehila";

// ─── Ornament SVG ─────────────────────────────────────────────────────────────

const CornerOrnament = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 60 60" className={`w-10 h-10 sm:w-14 sm:h-14 ${className}`} fill="currentColor">
    <path d="M0 0 L60 0 L60 8 L8 8 L8 60 L0 60 Z" opacity="0.6" />
    <path d="M0 0 L30 0 L30 4 L4 4 L4 30 L0 30 Z" />
    <circle cx="16" cy="16" r="5" />
    <path d="M22 4 Q30 16 22 28" strokeWidth="1.5" stroke="currentColor" fill="none" />
  </svg>
);

const Divider = () => (
  <div className="flex items-center justify-center gap-2 my-1">
    <span className="h-px flex-1 bg-red-800/40" />
    <span className="text-red-700 text-xs">✦</span>
    <span className="h-px flex-1 bg-red-800/40" />
  </div>
);

// ─── Card ─────────────────────────────────────────────────────────────────────

const SephardicCard: React.FC<{ item: Item; location: KehilaLocation; onEdit?: (item: Item) => void; isKiosk?: boolean }> = ({
  item, location, onEdit, isKiosk,
}) => {
  const times = useMemo(() => item.times.map((t) => ({ ...t, computed: calcTime(t, location) })), [item, location]);

  return (
    <div className="group relative mb-3 border border-red-900/40 rounded-sm overflow-hidden bg-gradient-to-b from-[#2a0a0a] to-[#1a0505]">
      {/* Corner accents */}
      <div className="absolute top-0 right-0 text-red-700/50 pointer-events-none"><CornerOrnament /></div>
      <div className="absolute top-0 left-0 text-red-700/50 pointer-events-none scale-x-[-1]"><CornerOrnament /></div>

      {/* Title */}
      <div className="relative text-center pt-3 pb-1 px-10">
        <div className="flex items-center justify-center gap-2 mb-0.5">
          <span className="h-px w-8 bg-red-600/50" />
          <span className="text-red-400 text-[10px]">✦</span>
          <span className="h-px w-8 bg-red-600/50" />
        </div>
        <h3 className="text-amber-200 font-bold text-lg sm:text-2xl lg:text-3xl font-serif tracking-wide drop-shadow">
          {item.title}
        </h3>
        <div className="flex items-center justify-center gap-2 mt-0.5">
          <span className="h-px w-8 bg-red-600/50" />
          <span className="text-red-400 text-[10px]">✦</span>
          <span className="h-px w-8 bg-red-600/50" />
        </div>
      </div>

      {/* Times */}
      <div className="px-4 sm:px-6 pb-3 pt-1 text-center space-y-1.5">
        {times.map((time, i) => (
          <div key={i} className="flex items-center justify-center gap-2">
            {time.name && <span className="text-red-300/70 text-xs sm:text-sm">{time.name}</span>}
            {time.name && <span className="h-px flex-1 bg-red-800/30 max-w-[40px]" />}
            <span className="text-amber-100 font-bold tabular-nums text-base sm:text-xl lg:text-2xl">{time.computed}</span>
          </div>
        ))}
        {item.description && (
          <p className="text-red-300/60 text-xs sm:text-sm mt-2 font-normal leading-relaxed">{item.description}</p>
        )}
      </div>

      {!isKiosk && onEdit && (
        <button aria-label="ערוך" onClick={() => onEdit(item)}
          className="absolute top-2 left-2 p-1.5 rounded bg-red-900/50 text-red-300 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-3.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" />
          </svg>
        </button>
      )}
    </div>
  );
};

// ─── Template ─────────────────────────────────────────────────────────────────

const COL_LABELS = ["☀️ יום חול", "✡️ שבת קודש", "📖 שיעורים"];

export const SephardicTemplate: React.FC<TemplateProps> = ({
  kehila, itemsRight, itemsMiddle, itemsLeft,
  announcements, zmanim, isKiosk = false, onEdit,
}) => {
  const active = announcements.filter((a) => !a.expiresAt || new Date(a.expiresAt) > new Date());
  const cols = [itemsRight, itemsMiddle, itemsLeft];

  return (
    <div
      className="h-screen relative overflow-hidden"
      dir="rtl"
      style={{ background: "linear-gradient(160deg, #1a0505 0%, #2d0b0b 40%, #1a0505 100%)" }}
    >
      {/* Tiled arabesque pattern overlay */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0 L40 20 L20 40 L0 20 Z' fill='none' stroke='%23ff6060' stroke-width='0.5'/%3E%3Ccircle cx='20' cy='20' r='8' fill='none' stroke='%23ff6060' stroke-width='0.3'/%3E%3C/svg%3E")`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Outer ornamental border */}
      <div className="absolute inset-2 sm:inset-4 border border-red-800/30 rounded pointer-events-none" />
      <div className="absolute inset-3 sm:inset-5 border border-red-900/20 rounded pointer-events-none" />

      <div className="relative z-10 flex flex-col h-screen">

        {/* ── Header ── */}
        <header className="text-center pt-5 sm:pt-8 pb-4 px-6 sm:px-12">
          {/* Top ornament */}
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-transparent to-red-700/60" />
            <span className="text-red-500 text-lg">✦ ✦ ✦</span>
            <span className="h-px flex-1 max-w-[80px] bg-gradient-to-l from-transparent to-red-700/60" />
          </div>

          {kehila.logoUrl && <img src={kehila.logoUrl} alt="לוגו" className="mx-auto h-14 mb-3 object-contain" />}

          <h1 className="text-amber-200 font-bold text-2xl sm:text-4xl lg:text-5xl font-serif tracking-widest drop-shadow-lg">
            {kehila.name}
          </h1>
          <p className="text-red-400 text-sm sm:text-base mt-1 tracking-widest">{kehila.city}</p>

          <Divider />

          <div className="flex flex-wrap items-center justify-center gap-3 mt-2 text-sm">
            <span className="text-amber-300/80 font-medium">{zmanim.hebrewDate}</span>
            {zmanim.parasha && (
              <span className="border border-red-700/50 text-amber-200/80 px-3 py-0.5 rounded-sm text-xs sm:text-sm tracking-wide">
                {zmanim.parasha}
              </span>
            )}
          </div>

          {/* Candle lighting */}
          <div className="flex flex-wrap justify-center gap-3 mt-3 text-xs sm:text-sm">
            <span className="flex items-center gap-1.5 border border-red-800/40 bg-red-950/50 text-amber-200/90 px-3 py-1 rounded-sm">
              🕯️ הדלקת נרות: <strong>{zmanim.candleLighting}</strong>
            </span>
            <span className="flex items-center gap-1.5 border border-red-800/40 bg-red-950/50 text-amber-200/90 px-3 py-1 rounded-sm">
              ✨ צאת שבת: <strong>{zmanim.shabbatEnd}</strong>
            </span>
          </div>

          {/* Bottom ornament */}
          <div className="flex items-center justify-center gap-3 mt-3">
            <span className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-transparent to-red-700/60" />
            <span className="text-red-500 text-lg">✦ ✦ ✦</span>
            <span className="h-px flex-1 max-w-[80px] bg-gradient-to-l from-transparent to-red-700/60" />
          </div>
        </header>

        {/* ── Announcements ── */}
        {active.length > 0 && (
          <div className="mx-4 sm:mx-8 mb-3 space-y-2">
            {active.map((a) => (
              <div key={a.id} className="flex items-center gap-2 border border-red-800/40 bg-red-950/40 px-4 py-2 rounded-sm text-sm text-amber-200/80">
                <span>{a.type === "simcha" ? "🎊" : a.type === "avel" ? "🕯️" : "📢"}</span>
                {a.text}
              </div>
            ))}
          </div>
        )}

        {/* ── Columns ── */}
        <main className="flex-1 px-2 sm:px-4 lg:px-10 pb-12 overflow-hidden">
          <div className="flex lg:grid lg:grid-cols-3 overflow-x-auto snap-x snap-mandatory gap-2 sm:gap-4 lg:gap-6 pb-2 lg:overflow-hidden h-full">
            {cols.map((colItems, ci) => (
              <div key={ci} className="min-w-[86vw] sm:min-w-[58vw] lg:min-w-0 snap-start flex-shrink-0 lg:flex-shrink">
                <div className="text-center mb-2">
                  <span className="text-red-400/70 text-xs sm:text-sm font-semibold tracking-widest">{COL_LABELS[ci]}</span>
                </div>
                {colItems.sort((a, b) => a.index - b.index).map((item) => (
                  <SephardicCard key={item._id} item={item} location={kehila.location} onEdit={onEdit} isKiosk={isKiosk} />
                ))}
              </div>
            ))}
          </div>
        </main>

        {/* ── Zmanim ticker ── */}
        <div className="fixed bottom-0 left-0 right-0 z-20 bg-gradient-to-r from-red-950 via-red-900 to-red-950 border-t border-red-800/50 py-2.5 overflow-hidden">
          <div className="flex whitespace-nowrap">
            {[0, 1, 2].map((i) => (
              <span key={i} className="animate-ticker text-amber-200/90 text-sm sm:text-base font-semibold px-6 shrink-0 tracking-wide">
                {[`זריחה: ${zmanim.sunrise}`, `חצות: ${zmanim.chatzot}`, `שקיעה: ${zmanim.shkiah}`, `מנחה גדולה: ${zmanim.minchaGedola}`, `הדלקת נרות: ${zmanim.candleLighting}`, `צאת שבת: ${zmanim.shabbatEnd}`].join("   ✦   ")}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
