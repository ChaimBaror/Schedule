"use client";
import React, { useMemo } from "react";
import type { TemplateProps } from "./types";
import type { Item } from "@/types/items";
import type { Block, TimesContent } from "@/types/block";
import { calcTime } from "./calcTime";
import type { KehilaLocation } from "@/types/kehila";
import { BlockRenderer } from "@/components/BlockRenderers";
import { isBlockVisible } from "@/utils/block-visibility";

// ─── Card ────────────────────────────────────────────────────────────────────

const MarbleCard: React.FC<{ item: Item; location: KehilaLocation }> = ({ item, location }) => {
  const times = useMemo(
    () => item.times.map((t) => ({ ...t, computed: calcTime(t, location) })),
    [item, location]
  );

  return (
    <div className="mb-4 rounded-2xl overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.75)",
        backdropFilter: "blur(12px)",
        boxShadow: "0 1px 8px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)",
      }}>

      {/* Title */}
      <div className="text-center py-3 px-5"
        style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
        <h3 className="font-bold text-xl sm:text-2xl lg:text-3xl tracking-wide"
          style={{ fontFamily: "'Frank Ruhl Libre', serif", color: "#1a1a2e" }}>
          {item.title}
        </h3>
      </div>

      {/* Times */}
      <div className="px-5 sm:px-7 py-4 space-y-2.5">
        {times.map((time, i) => (
          <div key={i} className="flex items-baseline gap-3">
            {time.name ? (
              <>
                <span className="text-sm sm:text-base font-medium shrink-0"
                  style={{ fontFamily: "'Frank Ruhl Libre', serif", color: "#6b7280" }}>
                  {time.name}
                </span>
                <span className="flex-1 border-b border-dashed min-w-[16px] relative -top-1"
                  style={{ borderColor: "rgba(0,0,0,0.1)" }} />
                <span className="font-bold tabular-nums text-lg sm:text-xl lg:text-2xl shrink-0"
                  style={{ fontFamily: "'Frank Ruhl Libre', serif", color: "#1a1a2e" }}>
                  {time.computed}
                </span>
              </>
            ) : (
              <span className="font-bold tabular-nums text-lg sm:text-xl lg:text-2xl w-full text-center"
                style={{ fontFamily: "'Frank Ruhl Libre', serif", color: "#1a1a2e" }}>
                {time.computed}
              </span>
            )}
          </div>
        ))}
        {item.description && (
          <p className="text-xs sm:text-sm mt-2 text-center leading-relaxed"
            style={{ fontFamily: "'Frank Ruhl Libre', serif", color: "#9ca3af" }}>
            {item.description}
          </p>
        )}
      </div>
    </div>
  );
};

// ─── Column ──────────────────────────────────────────────────────────────────

const COL_LABELS = ["יום חול", "שבת קודש", "שיעורים"];

const MarbleBlockColumn: React.FC<{
  blocks: Block[]; colIndex: number; location: KehilaLocation;
}> = ({ blocks, colIndex, location }) => {
  const now = useMemo(() => new Date(), []);
  const visible = blocks.filter((b) => isBlockVisible(b, now)).sort((a, b) => a.index - b.index);

  return (
    <div className="min-w-[86vw] sm:min-w-[58vw] lg:min-w-0 snap-start flex-shrink-0 lg:flex-shrink">
      <div className="text-center mb-4 py-2">
        <span className="text-xs sm:text-sm font-bold tracking-[0.3em] uppercase"
          style={{ fontFamily: "'Frank Ruhl Libre', serif", color: "#9ca3af" }}>
          {COL_LABELS[colIndex]}
        </span>
        <div className="mx-auto mt-1.5 w-12 h-px" style={{ background: "linear-gradient(90deg, transparent, #d1d5db, transparent)" }} />
      </div>
      {visible.map((block) => {
        if (block.type === "times") {
          const c = block.content as TimesContent;
          return <MarbleCard key={block.id} item={{ _id: block.id, title: c.title, times: c.times, description: c.description, index: block.index }} location={location} />;
        }
        return (
          <div key={block.id} className="mb-4 px-5 py-4 text-center rounded-2xl"
            style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(12px)", color: "#1a1a2e", boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
            <BlockRenderer block={block} location={location} />
          </div>
        );
      })}
    </div>
  );
};

// ─── Ticker ──────────────────────────────────────────────────────────────────

const MarbleTicker: React.FC<{ text: string }> = ({ text }) => (
  <div className="overflow-hidden py-2.5"
    style={{
      background: "rgba(255,255,255,0.85)",
      backdropFilter: "blur(12px)",
      borderTop: "1px solid rgba(0,0,0,0.06)",
    }}>
    <div className="flex whitespace-nowrap">
      {[0, 1, 2].map((i) => (
        <span key={i} className="animate-ticker text-sm sm:text-base font-semibold px-8 shrink-0 tracking-wide"
          style={{ fontFamily: "'Frank Ruhl Libre', serif", color: "#4b5563" }}>
          {text}
        </span>
      ))}
    </div>
  </div>
);

// ─── Template ────────────────────────────────────────────────────────────────

export const MarbleTemplate: React.FC<TemplateProps> = ({
  kehila, itemsRight, itemsMiddle, itemsLeft,
  announcements, zmanim, isKiosk = false, onEdit, blocks,
}) => {
  const useBlox = blocks && blocks.length > 0;
  const rightBlocks = useMemo(() => blocks?.filter((b) => b.col === "right") ?? [], [blocks]);
  const middleBlocks = useMemo(() => blocks?.filter((b) => b.col === "middle") ?? [], [blocks]);
  const leftBlocks = useMemo(() => blocks?.filter((b) => b.col === "left") ?? [], [blocks]);

  const active = announcements.filter((a) => !a.expiresAt || new Date(a.expiresAt) > new Date());

  const zmanimText = [
    `זריחה: ${zmanim.sunrise}`, `סוף ק"ש: ${zmanim.sofZmanShma}`, `חצות: ${zmanim.chatzot}`,
    `מנחה גדולה: ${zmanim.minchaGedola}`, `שקיעה: ${zmanim.shkiah}`,
    `הדלקת נרות: ${zmanim.candleLighting}`, `צאת שבת: ${zmanim.shabbatEnd}`,
  ].join("   ·   ");

  const annText = active.length > 0
    ? active.map((a) => `${a.type === "simcha" ? "🎊" : a.type === "avel" ? "🕯️" : "📢"} ${a.text}`).join("   ·   ")
    : null;
  const tickerText = annText ? `${annText}   ·   ${zmanimText}` : zmanimText;

  return (
    <div className="relative w-full h-screen overflow-hidden" dir="rtl"
      style={{ background: "linear-gradient(145deg, #f5f0eb 0%, #ebe5dd 25%, #f0ece6 50%, #e8e2d8 100%)" }}>

      {/* Marble texture overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }} />

      {/* Subtle vignette */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ boxShadow: "inset 0 0 120px rgba(0,0,0,0.08)" }} />

      <div className="relative z-10 flex flex-col h-screen pb-12">

        {/* ── Header ── */}
        <header className="text-center pt-6 sm:pt-10 pb-4 px-6">
          {kehila.logoUrl && (
            <img src={kehila.logoUrl} alt="לוגו" className="mx-auto h-14 sm:h-18 mb-3 object-contain" />
          )}

          <h1 className="font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-widest"
            style={{ fontFamily: "'Frank Ruhl Libre', serif", color: "#1a1a2e" }}>
            {kehila.name}
          </h1>

          <p className="text-sm sm:text-base mt-1 tracking-widest font-medium"
            style={{ fontFamily: "'Frank Ruhl Libre', serif", color: "#9ca3af" }}>
            {kehila.city}
          </p>

          {/* Thin line */}
          <div className="mx-auto mt-3 mb-2 w-24 h-px" style={{ background: "linear-gradient(90deg, transparent, #c9a84c, transparent)" }} />

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 text-sm sm:text-lg">
            <span className="font-bold" style={{ fontFamily: "'Frank Ruhl Libre', serif", color: "#374151" }}>
              {zmanim.hebrewDate}
            </span>
            {zmanim.parasha && (
              <>
                <span style={{ color: "#d1d5db" }}>·</span>
                <span className="font-medium" style={{ fontFamily: "'Frank Ruhl Libre', serif", color: "#6b7280" }}>
                  {zmanim.parasha}
                </span>
              </>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-8 mt-2 text-sm sm:text-base">
            <span className="px-3 py-1 rounded-full"
              style={{ fontFamily: "'Frank Ruhl Libre', serif", color: "#4b5563", background: "rgba(0,0,0,0.04)" }}>
              🕯️ הדלקת נרות: <strong style={{ color: "#1a1a2e" }}>{zmanim.candleLighting}</strong>
            </span>
            <span className="px-3 py-1 rounded-full"
              style={{ fontFamily: "'Frank Ruhl Libre', serif", color: "#4b5563", background: "rgba(0,0,0,0.04)" }}>
              צאת שבת: <strong style={{ color: "#1a1a2e" }}>{zmanim.shabbatEnd}</strong>
            </span>
          </div>
        </header>

        {/* ── Announcements ── */}
        {active.length > 0 && (
          <div className="mx-6 sm:mx-16 mb-3 space-y-2">
            {active.map((a) => (
              <div key={a.id} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium"
                style={{
                  background: "rgba(255,255,255,0.6)",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                  color: "#374151",
                  fontFamily: "'Frank Ruhl Libre', serif",
                }}>
                <span className="text-base shrink-0">{a.type === "simcha" ? "🎊" : a.type === "avel" ? "🕯️" : "📢"}</span>
                {a.text}
              </div>
            ))}
          </div>
        )}

        {/* ── Columns ── */}
        <main className="flex-1 px-4 sm:px-8 lg:px-16 overflow-hidden">
          <div className="flex lg:grid lg:grid-cols-3 overflow-x-auto snap-x snap-mandatory gap-4 sm:gap-5 lg:gap-8 pb-2 lg:overflow-hidden h-full">
            {useBlox
              ? [rightBlocks, middleBlocks, leftBlocks].map((col, ci) => (
                  <MarbleBlockColumn key={ci} blocks={col} colIndex={ci} location={kehila.location} />
                ))
              : [itemsRight, itemsMiddle, itemsLeft].map((col, ci) => (
                  <div key={ci} className="min-w-[86vw] sm:min-w-[58vw] lg:min-w-0 snap-start flex-shrink-0 lg:flex-shrink">
                    <div className="text-center mb-4 py-2">
                      <span className="text-xs sm:text-sm font-bold tracking-[0.3em] uppercase"
                        style={{ fontFamily: "'Frank Ruhl Libre', serif", color: "#9ca3af" }}>
                        {COL_LABELS[ci]}
                      </span>
                      <div className="mx-auto mt-1.5 w-12 h-px" style={{ background: "linear-gradient(90deg, transparent, #d1d5db, transparent)" }} />
                    </div>
                    {col.sort((a, b) => a.index - b.index).map((item) => (
                      <MarbleCard key={item._id} item={item} location={kehila.location} />
                    ))}
                  </div>
                ))
            }
          </div>
        </main>
      </div>

      {/* ── Ticker ── */}
      <div className="fixed bottom-0 left-0 right-0 z-20">
        <MarbleTicker text={tickerText} />
      </div>
    </div>
  );
};
