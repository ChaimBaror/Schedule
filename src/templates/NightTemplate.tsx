"use client";
import React, { useMemo, useEffect, useState } from "react";
import type { TemplateProps } from "./types";
import type { Item } from "@/types/items";
import { calcTime } from "./calcTime";
import type { KehilaLocation } from "@/types/kehila";

// ─── Twinkling stars ──────────────────────────────────────────────────────────

const STARS = Array.from({ length: 40 }, (_, i) => ({
  x: (i * 37 + 11) % 100,
  y: (i * 53 + 7) % 60,
  size: (i % 3) + 1,
  delay: (i * 0.3) % 3,
}));

const StarField = () => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
    {STARS.map((s, i) => (
      <circle
        key={i}
        cx={`${s.x}%`}
        cy={`${s.y}%`}
        r={s.size}
        fill="white"
        opacity={0.4 + (i % 4) * 0.15}
        style={{ animation: `pulse ${2 + s.delay}s ease-in-out infinite alternate` }}
      />
    ))}
  </svg>
);

// ─── Card ─────────────────────────────────────────────────────────────────────

const NightCard: React.FC<{ item: Item; location: KehilaLocation; onEdit?: (item: Item) => void; isKiosk?: boolean }> = ({
  item, location, onEdit, isKiosk,
}) => {
  const times = useMemo(() => item.times.map((t) => ({ ...t, computed: calcTime(t, location) })), [item, location]);

  return (
    <div className="group relative mb-2.5 rounded-2xl overflow-hidden border border-blue-400/20"
      style={{ background: "linear-gradient(180deg, rgba(30,58,120,0.6) 0%, rgba(15,30,80,0.8) 100%)", backdropFilter: "blur(8px)" }}>

      {/* Shimmer top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-300/40 to-transparent" />

      {/* Title */}
      <div className="text-center pt-3 pb-2 px-4 border-b border-blue-400/15">
        <h3 className="text-white font-bold text-lg sm:text-2xl lg:text-3xl tracking-wide"
          style={{ textShadow: "0 0 20px rgba(147,197,253,0.5)" }}>
          {item.title}
        </h3>
      </div>

      {/* Times */}
      <div className="px-4 sm:px-6 py-3 text-center space-y-2">
        {times.map((time, i) => (
          <div key={i} className="flex items-center justify-center gap-2">
            {time.name && <span className="text-blue-300/70 text-xs sm:text-sm">{time.name}</span>}
            {time.name && <span className="h-px flex-1 bg-blue-400/20 max-w-[40px]" />}
            <span className="text-blue-100 font-bold tabular-nums text-base sm:text-xl lg:text-2xl"
              style={{ textShadow: "0 0 12px rgba(147,197,253,0.4)" }}>
              {time.computed}
            </span>
          </div>
        ))}
        {item.description && (
          <p className="text-blue-300/60 text-xs sm:text-sm mt-2 font-normal leading-relaxed">{item.description}</p>
        )}
      </div>

      {!isKiosk && onEdit && (
        <button aria-label="ערוך" onClick={() => onEdit(item)}
          className="absolute top-2 left-2 p-1.5 rounded-full bg-blue-900/50 text-blue-300 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-3.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" />
          </svg>
        </button>
      )}
    </div>
  );
};

// ─── Template ─────────────────────────────────────────────────────────────────

const COL_LABELS = ["יום חול", "שבת קודש", "שיעורים"];
const COL_ICONS  = ["🌅", "✡️", "📖"];

export const NightTemplate: React.FC<TemplateProps> = ({
  kehila, itemsRight, itemsMiddle, itemsLeft,
  announcements, zmanim, isKiosk = false, onEdit,
}) => {
  const [clock, setClock] = useState("");
  const active = announcements.filter((a) => !a.expiresAt || new Date(a.expiresAt) > new Date());
  const cols = [itemsRight, itemsMiddle, itemsLeft];

  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const zmanimList = [
    { l: "זריחה", v: zmanim.sunrise, icon: "🌅" },
    { l: 'סוף ק"ש', v: zmanim.sofZmanShma, icon: "📿" },
    { l: "חצות", v: zmanim.chatzot, icon: "☀️" },
    { l: "מנחה גד'", v: zmanim.minchaGedola, icon: "🕑" },
    { l: "שקיעה", v: zmanim.shkiah, icon: "🌇" },
    { l: "נרות", v: zmanim.candleLighting, icon: "🕯️" },
    { l: "צאת שבת", v: zmanim.shabbatEnd, icon: "✨" },
  ];

  return (
    <div className="h-screen relative overflow-hidden" dir="rtl"
      style={{ background: "linear-gradient(160deg, #0a0f2e 0%, #0d1640 40%, #060c28 100%)" }}>

      {/* Star field */}
      <StarField />

      {/* Nebula glow */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)" }} />
      <div className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)" }} />

      <div className="relative z-10 flex flex-col h-screen">

        {/* ── Header ── */}
        <header className="text-center pt-5 sm:pt-8 pb-4 px-4 sm:px-8">
          {kehila.logoUrl && <img src={kehila.logoUrl} alt="לוגו" className="mx-auto h-12 mb-3 object-contain opacity-90" />}

          {/* Moon + Name */}
          <div className="flex items-center justify-center gap-3 mb-1">
            <span className="text-3xl">🌙</span>
            <h1 className="text-white font-bold text-2xl sm:text-4xl lg:text-5xl tracking-wide"
              style={{ textShadow: "0 0 30px rgba(147,197,253,0.6), 0 2px 4px rgba(0,0,0,0.5)" }}>
              {kehila.name}
            </h1>
          </div>

          <p className="text-blue-300/70 text-sm sm:text-base tracking-widest">{kehila.city}</p>

          {/* Live clock */}
          {clock && (
            <div className="text-blue-200/50 text-sm sm:text-base tabular-nums mt-1">{clock}</div>
          )}

          {/* Divider with stars */}
          <div className="flex items-center justify-center gap-2 my-2.5">
            <span className="h-px flex-1 max-w-[60px]" style={{ background: "linear-gradient(to right, transparent, rgba(147,197,253,0.3))" }} />
            <span className="text-blue-300/50 text-xs tracking-[8px]">★ ★ ★</span>
            <span className="h-px flex-1 max-w-[60px]" style={{ background: "linear-gradient(to left, transparent, rgba(147,197,253,0.3))" }} />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 text-sm sm:text-base">
            <span className="text-blue-100/80 font-medium">{zmanim.hebrewDate}</span>
            {zmanim.parasha && (
              <span className="border border-blue-400/30 text-blue-200/80 px-3 py-0.5 rounded-full text-xs sm:text-sm"
                style={{ background: "rgba(59,130,246,0.1)" }}>
                {zmanim.parasha}
              </span>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-3 mt-2.5 text-xs sm:text-sm">
            {[
              { icon: "🕯️", label: "הדלקת נרות", v: zmanim.candleLighting },
              { icon: "✨", label: "צאת שבת", v: zmanim.shabbatEnd },
            ].map(({ icon, label, v }) => (
              <span key={label} className="flex items-center gap-1.5 border border-blue-400/20 text-blue-100/80 px-3 py-1 rounded-full text-xs sm:text-sm"
                style={{ background: "rgba(30,58,120,0.4)" }}>
                {icon} {label}: <strong>{v}</strong>
              </span>
            ))}
          </div>
        </header>

        {/* ── Announcements ── */}
        {active.length > 0 && (
          <div className="mx-4 sm:mx-8 mb-3 space-y-2">
            {active.map((a) => (
              <div key={a.id} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-blue-100/80 border border-blue-400/20"
                style={{ background: "rgba(30,58,120,0.4)", backdropFilter: "blur(4px)" }}>
                <span>{a.type === "simcha" ? "🎊" : a.type === "avel" ? "🕯️" : "📢"}</span>
                {a.text}
              </div>
            ))}
          </div>
        )}

        {/* ── Columns ── */}
        <main className="flex-1 px-2 sm:px-4 lg:px-10 pb-16 overflow-hidden">
          <div className="flex lg:grid lg:grid-cols-3 overflow-x-auto snap-x snap-mandatory gap-2 sm:gap-4 pb-2 lg:overflow-hidden h-full">
            {cols.map((colItems, ci) => (
              <div key={ci} className="min-w-[86vw] sm:min-w-[58vw] lg:min-w-0 snap-start flex-shrink-0 lg:flex-shrink">
                <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-blue-400/15">
                  <span>{COL_ICONS[ci]}</span>
                  <span className="text-blue-300/80 text-xs sm:text-sm font-semibold tracking-widest">{COL_LABELS[ci]}</span>
                </div>
                {colItems.sort((a, b) => a.index - b.index).map((item) => (
                  <NightCard key={item._id} item={item} location={kehila.location} onEdit={onEdit} isKiosk={isKiosk} />
                ))}
              </div>
            ))}
          </div>
        </main>

        {/* ── Zmanim footer ── */}
        <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-blue-400/20"
          style={{ background: "rgba(10,15,46,0.95)", backdropFilter: "blur(12px)" }}>
          <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-7 divide-x divide-x-reverse divide-blue-400/10">
            {zmanimList.map(({ l, v, icon }) => (
              <div key={l} className="text-center px-1 py-2">
                <div className="text-base leading-none">{icon}</div>
                <div className="text-blue-200 font-bold text-xs sm:text-sm tabular-nums mt-0.5"
                  style={{ textShadow: "0 0 8px rgba(147,197,253,0.4)" }}>{v}</div>
                <div className="text-blue-500 text-[9px] sm:text-[10px]">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`@keyframes pulse { from { opacity: 0.3 } to { opacity: 0.9 } }`}</style>
    </div>
  );
};
