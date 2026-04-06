"use client";
import React, { useMemo, useEffect, useState } from "react";
import type { TemplateProps } from "./types";
import type { Item } from "@/types/items";
import { calcTime } from "./calcTime";
import type { KehilaLocation } from "@/types/kehila";

// ─── Card ─────────────────────────────────────────────────────────────────────

const GoldenCard: React.FC<{ item: Item; location: KehilaLocation; onEdit?: (item: Item) => void; isKiosk?: boolean }> = ({
  item, location, onEdit, isKiosk,
}) => {
  const times = useMemo(() => item.times.map((t) => ({ ...t, computed: calcTime(t, location) })), [item, location]);

  return (
    <div className="group relative mb-2.5 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #1a1400 0%, #120f00 100%)",
        border: "1px solid rgba(218,165,32,0.3)",
        borderRadius: "4px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(218,165,32,0.1)",
      }}>

      {/* Gold shimmer line */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(218,165,32,0.6), transparent)" }} />

      {/* Title bar */}
      <div className="text-center py-2 px-4"
        style={{ background: "linear-gradient(90deg, transparent, rgba(218,165,32,0.08), transparent)", borderBottom: "1px solid rgba(218,165,32,0.15)" }}>
        <h3 className="font-bold text-lg sm:text-2xl lg:text-3xl tracking-wide"
          style={{ color: "#DAA520", textShadow: "0 0 20px rgba(218,165,32,0.4)", fontFamily: "serif" }}>
          {item.title}
        </h3>
      </div>

      {/* Times */}
      <div className="px-4 sm:px-6 py-3 text-center space-y-2">
        {times.map((time, i) => (
          <div key={i} className="flex items-center justify-center gap-2">
            {time.name && (
              <span className="text-xs sm:text-sm" style={{ color: "rgba(218,165,32,0.5)" }}>{time.name}</span>
            )}
            {time.name && <span className="h-px flex-1 max-w-[40px]" style={{ background: "rgba(218,165,32,0.2)" }} />}
            <span className="font-bold tabular-nums text-base sm:text-xl lg:text-2xl"
              style={{ color: "#F5D060", textShadow: "0 0 10px rgba(218,165,32,0.3)", fontFamily: "serif" }}>
              {time.computed}
            </span>
          </div>
        ))}
        {item.description && (
          <p className="text-xs sm:text-sm mt-2 font-normal leading-relaxed"
            style={{ color: "rgba(218,165,32,0.45)" }}>{item.description}</p>
        )}
      </div>

      {/* Bottom shimmer */}
      <div className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(218,165,32,0.3), transparent)" }} />

      {!isKiosk && onEdit && (
        <button aria-label="ערוך" onClick={() => onEdit(item)}
          className="absolute top-2 left-2 p-1.5 rounded opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
          style={{ background: "rgba(218,165,32,0.15)", color: "#DAA520" }}>
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

export const GoldenTemplate: React.FC<TemplateProps> = ({
  kehila, itemsRight, itemsMiddle, itemsLeft,
  announcements, zmanim, isKiosk = false, onEdit,
}) => {
  const [clock, setClock] = useState("");
  const active = announcements.filter((a) => !a.expiresAt || new Date(a.expiresAt) > new Date());
  const cols = [itemsRight, itemsMiddle, itemsLeft];

  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const gold = "#DAA520";
  const goldFaint = "rgba(218,165,32,0.25)";

  return (
    <div className="h-screen relative overflow-hidden" dir="rtl"
      style={{ background: "linear-gradient(160deg, #0d0b00 0%, #1a1500 50%, #0d0b00 100%)" }}>

      {/* Diagonal gold lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, ${gold} 0px, ${gold} 1px, transparent 1px, transparent 30px)`,
        }}
      />

      {/* Corner glows */}
      <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none"
        style={{ background: `radial-gradient(circle at top right, rgba(218,165,32,0.08), transparent 70%)` }} />
      <div className="absolute bottom-0 left-0 w-48 h-48 pointer-events-none"
        style={{ background: `radial-gradient(circle at bottom left, rgba(218,165,32,0.06), transparent 70%)` }} />

      <div className="relative z-10 flex flex-col h-screen">

        {/* ── Header ── */}
        <header className="text-center pt-5 sm:pt-8 pb-4 px-4 sm:px-8"
          style={{ borderBottom: `1px solid ${goldFaint}` }}>

          {/* Top ornament */}
          <div className="flex items-center justify-center gap-3 mb-3">
            <svg width="80" height="12" viewBox="0 0 80 12" className="opacity-40">
              <line x1="0" y1="6" x2="30" y2="6" stroke={gold} strokeWidth="1"/>
              <polygon points="35,6 32,3 38,3" fill={gold}/>
              <circle cx="40" cy="6" r="3" fill={gold}/>
              <polygon points="45,6 42,9 48,9" fill={gold}/>
              <line x1="50" y1="6" x2="80" y2="6" stroke={gold} strokeWidth="1"/>
            </svg>
          </div>

          {kehila.logoUrl && <img src={kehila.logoUrl} alt="לוגו" className="mx-auto h-12 mb-3 object-contain opacity-80" />}

          <h1 className="font-bold text-2xl sm:text-4xl lg:text-5xl tracking-widest"
            style={{ color: gold, textShadow: `0 0 30px rgba(218,165,32,0.5), 0 2px 4px rgba(0,0,0,0.8)`, fontFamily: "serif" }}>
            {kehila.name}
          </h1>

          <p className="text-sm sm:text-base mt-1 tracking-widest" style={{ color: "rgba(218,165,32,0.5)" }}>
            {kehila.city}
          </p>

          {/* Clock */}
          {clock && (
            <div className="text-xl sm:text-2xl tabular-nums font-bold mt-1"
              style={{ color: "rgba(218,165,32,0.6)", fontFamily: "serif" }}>{clock}</div>
          )}

          {/* Bottom ornament */}
          <div className="flex items-center justify-center gap-3 mt-2 mb-2">
            <svg width="80" height="12" viewBox="0 0 80 12" className="opacity-40">
              <line x1="0" y1="6" x2="30" y2="6" stroke={gold} strokeWidth="1"/>
              <polygon points="35,6 32,3 38,3" fill={gold}/>
              <circle cx="40" cy="6" r="3" fill={gold}/>
              <polygon points="45,6 42,9 48,9" fill={gold}/>
              <line x1="50" y1="6" x2="80" y2="6" stroke={gold} strokeWidth="1"/>
            </svg>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
            <span className="font-medium" style={{ color: "rgba(218,165,32,0.8)" }}>{zmanim.hebrewDate}</span>
            {zmanim.parasha && (
              <span className="px-3 py-0.5 text-xs sm:text-sm rounded" style={{ border: `1px solid ${goldFaint}`, color: "rgba(218,165,32,0.7)", background: "rgba(218,165,32,0.05)", fontFamily: "serif" }}>
                {zmanim.parasha}
              </span>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-3 mt-2.5 text-xs sm:text-sm">
            {[{ icon: "🕯️", l: "הדלקת נרות", v: zmanim.candleLighting }, { icon: "✨", l: "צאת שבת", v: zmanim.shabbatEnd }].map(({ icon, l, v }) => (
              <span key={l} className="flex items-center gap-1.5 px-3 py-1 rounded" style={{ border: `1px solid ${goldFaint}`, color: "rgba(218,165,32,0.75)", background: "rgba(218,165,32,0.04)" }}>
                {icon} {l}: <strong>{v}</strong>
              </span>
            ))}
          </div>
        </header>

        {/* ── Announcements ── */}
        {active.length > 0 && (
          <div className="mx-4 sm:mx-8 mt-3 space-y-2">
            {active.map((a) => (
              <div key={a.id} className="flex items-center gap-2 px-4 py-2 text-sm rounded" style={{ border: `1px solid ${goldFaint}`, color: "rgba(218,165,32,0.7)", background: "rgba(218,165,32,0.04)" }}>
                <span>{a.type === "simcha" ? "🎊" : a.type === "avel" ? "🕯️" : "📢"}</span>
                {a.text}
              </div>
            ))}
          </div>
        )}

        {/* ── Columns ── */}
        <main className="flex-1 px-2 sm:px-4 lg:px-10 py-4 pb-14 overflow-hidden">
          <div className="flex lg:grid lg:grid-cols-3 overflow-x-auto snap-x snap-mandatory gap-2 sm:gap-4 lg:gap-5 pb-2 lg:overflow-hidden h-full">
            {cols.map((colItems, ci) => (
              <div key={ci} className="min-w-[86vw] sm:min-w-[58vw] lg:min-w-0 snap-start flex-shrink-0 lg:flex-shrink">
                <div className="flex items-center gap-2 mb-2 pb-1" style={{ borderBottom: `1px solid ${goldFaint}` }}>
                  <span className="text-xs sm:text-sm font-semibold tracking-widest" style={{ color: "rgba(218,165,32,0.5)", fontFamily: "serif" }}>
                    — {COL_LABELS[ci]} —
                  </span>
                </div>
                {colItems.sort((a, b) => a.index - b.index).map((item) => (
                  <GoldenCard key={item._id} item={item} location={kehila.location} onEdit={onEdit} isKiosk={isKiosk} />
                ))}
              </div>
            ))}
          </div>
        </main>

        {/* ── Zmanim footer ── */}
        <div className="fixed bottom-0 left-0 right-0 z-20 overflow-hidden"
          style={{ background: "rgba(13,11,0,0.97)", borderTop: `1px solid ${goldFaint}` }}>
          <div className="flex whitespace-nowrap py-2.5">
            {[0, 1, 2].map((i) => (
              <span key={i} className="animate-ticker text-sm sm:text-base font-semibold px-6 shrink-0 tracking-widest"
                style={{ color: gold, fontFamily: "serif", textShadow: `0 0 10px rgba(218,165,32,0.3)` }}>
                {[`זריחה: ${zmanim.sunrise}`, `חצות: ${zmanim.chatzot}`, `שקיעה: ${zmanim.shkiah}`, `מנחה גדולה: ${zmanim.minchaGedola}`, `הדלקת נרות: ${zmanim.candleLighting}`, `צאת שבת: ${zmanim.shabbatEnd}`].join("  ◆  ")}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
