"use client";
import React, { useMemo, useEffect, useState } from "react";
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

const LedCard: React.FC<{ item: Item; location: KehilaLocation }> = ({ item, location }) => {
  const times = useMemo(
    () => item.times.map((t) => ({ ...t, computed: calcTime(t, location) })),
    [item, location]
  );

  return (
    <div className="mb-2 rounded-xl overflow-hidden border border-green-500/30 bg-green-950/40">
      {/* Title */}
      <div className="px-3 py-1.5 bg-green-500/15 border-b border-green-500/20 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shrink-0" />
        <span className="text-green-200 font-bold text-sm sm:text-lg lg:text-xl tracking-wider font-mono">
          {item.title}
        </span>
      </div>

      {/* Times */}
      <div className="px-3 py-2 space-y-1">
        {times.map((time, i) => (
          <div key={i} className="flex items-center justify-between gap-2">
            {time.name && (
              <span className="text-green-600 text-xs sm:text-sm font-mono shrink-0">{time.name}</span>
            )}
            <span className="font-mono font-bold tabular-nums text-green-300 text-sm sm:text-xl lg:text-2xl mr-auto text-left">
              {time.computed}
            </span>
          </div>
        ))}
        {item.description && (
          <p className="text-green-700 text-xs font-mono mt-1 leading-relaxed">{item.description}</p>
        )}
      </div>
    </div>
  );
};

// ─── Template ─────────────────────────────────────────────────────────────────

const COL_LABELS = ["יום חול", "שבת קודש", "שיעורים"];

const ZMANIM_ITEMS = [
  { key: "sunrise",        label: "זריחה" },
  { key: "sofZmanShma",    label: 'סוף ק"ש' },
  { key: "chatzot",        label: "חצות" },
  { key: "minchaGedola",   label: "מנחה גד'" },
  { key: "shkiah",         label: "שקיעה" },
  { key: "candleLighting", label: "נרות" },
  { key: "shabbatEnd",     label: "צאת שבת" },
] as const;

export const LedTemplate: React.FC<TemplateProps> = ({
  kehila, itemsRight, itemsMiddle, itemsLeft,
  announcements, zmanim,
}) => {
  const [clock, setClock] = useState("");
  const [annIdx, setAnnIdx] = useState(0);
  const [scanLine, setScanLine] = useState(0);

  const active = announcements.filter((a) => !a.expiresAt || new Date(a.expiresAt) > new Date());
  const cols = [itemsRight, itemsMiddle, itemsLeft];

  // Clock
  useEffect(() => {
    const tick = () => setClock(
      new Date().toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Announcement rotation
  useEffect(() => {
    if (!active.length) return;
    const id = setInterval(() => setAnnIdx((i) => (i + 1) % active.length), 6000);
    return () => clearInterval(id);
  }, [active.length]);

  // Scan line animation
  useEffect(() => {
    const id = setInterval(() => setScanLine((l) => (l + 1) % 100), 30);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="h-screen bg-black text-green-400 font-mono overflow-hidden relative"
      dir="rtl"
    >
      {/* Subtle scanline effect */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, #00ff00 2px, #00ff00 3px)",
        }}
      />
      {/* Moving highlight */}
      <div
        className="pointer-events-none absolute left-0 right-0 h-8 z-0 opacity-[0.04] bg-green-400 blur-sm transition-none"
        style={{ top: `${scanLine}%` }}
      />

      <div className="relative z-10 flex flex-col h-screen">

        {/* ── Header ── */}
        <div className="border-b border-green-500/30 bg-black/80 px-3 sm:px-6 py-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            {/* Name */}
            <div className="flex items-center gap-3">
              {kehila.logoUrl && (
                <img src={kehila.logoUrl} alt="לוגו" className="h-10 w-10 rounded-lg object-contain border border-green-500/30 bg-black/50" />
              )}
              <div>
              <div className="flex items-center gap-2">
                <span className="text-green-500 text-xs font-bold tracking-widest">[ SYS ]</span>
                <span className="text-green-200 font-bold text-lg sm:text-2xl lg:text-3xl tracking-[0.15em]">
                  {kehila.name}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="text-green-600 text-xs sm:text-sm">
                  {kehila.city}
                </span>
                <span className="text-green-700 text-xs">·</span>
                <span className="text-green-500 text-xs sm:text-sm">{zmanim.hebrewDate}</span>
                {zmanim.parasha && (
                  <>
                    <span className="text-green-700 text-xs">·</span>
                    <span className="text-green-400 text-xs sm:text-sm">{zmanim.parasha}</span>
                  </>
                )}
              </div>
              </div>
            </div>

            {/* Clock */}
            <div className="text-right">
              <div className="text-green-300 font-bold text-3xl sm:text-5xl lg:text-6xl tabular-nums tracking-widest leading-none">
                {clock}
              </div>
              <div className="text-green-700 text-xs text-left mt-0.5 tracking-widest">
                {new Date().toLocaleDateString("he-IL", { weekday: "long" })}
              </div>
            </div>
          </div>
        </div>

        {/* ── Announcement bar ── */}
        <div className="border-b border-green-500/20 bg-green-950/60 px-3 sm:px-6 py-2 min-h-[2.75rem] flex items-center gap-3">
          {active.length > 0 ? (
            <>
              <span className="text-yellow-400 text-xs font-bold tracking-widest shrink-0 animate-pulse">
                ▶ הודעה
              </span>
              <div className="h-3 w-px bg-green-700 shrink-0" />
              <span className="text-yellow-200 text-sm sm:text-base lg:text-lg font-medium">
                {active[annIdx]?.text}
              </span>
              {active.length > 1 && (
                <span className="text-green-600 text-xs ml-auto shrink-0">
                  {annIdx + 1}/{active.length}
                </span>
              )}
            </>
          ) : (
            <span className="text-green-800 text-xs tracking-widest">— אין הודעות —</span>
          )}
        </div>

        {/* ── Columns ── */}
        <main className="flex-1 p-2 sm:p-3 lg:p-4 overflow-hidden">
          <div className="flex lg:grid lg:grid-cols-3 overflow-x-auto snap-x snap-mandatory gap-2 sm:gap-3 pb-2 lg:overflow-hidden h-full">
            {cols.map((colItems, ci) => (
              <div
                key={ci}
                className="min-w-[88vw] sm:min-w-[55vw] lg:min-w-0 snap-start flex-shrink-0 lg:flex-shrink"
              >
                {/* Column header */}
                <div className="flex items-center gap-2 mb-2 pb-1 border-b border-green-500/20">
                  <span className="text-green-600 text-xs tracking-widest">[ {String(ci + 1).padStart(2, "0")} ]</span>
                  <span className="text-green-400 text-xs sm:text-sm font-bold tracking-wider">{COL_LABELS[ci]}</span>
                </div>

                {colItems.sort((a, b) => a.index - b.index).map((item) => (
                  <LedCard key={item._id} item={item} location={kehila.location} />
                ))}
              </div>
            ))}
          </div>
        </main>

        {/* ── Zmanim footer ── */}
        <div className="border-t border-green-500/20 bg-black/60 px-2 sm:px-4 lg:px-6 py-2">
          <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-7 gap-1 sm:gap-2">
            {ZMANIM_ITEMS.map(({ key, label }) => (
              <div key={key} className="text-center border border-green-500/15 rounded-lg px-1 py-1.5 bg-green-950/30">
                <div className="text-green-700 text-[9px] sm:text-xs leading-tight">{label}</div>
                <div className="text-green-300 font-bold text-xs sm:text-sm tabular-nums mt-0.5">
                  {zmanim[key]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
