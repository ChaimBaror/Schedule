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

const WoodCard: React.FC<{ item: Item; location: KehilaLocation }> = ({ item, location }) => {
  const times = useMemo(
    () => item.times.map((t) => ({ ...t, computed: calcTime(t, location) })),
    [item, location]
  );

  return (
    <div className="mb-3 rounded-md overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #3e2a1a 0%, #2f1f12 100%)",
        border: "1px solid rgba(160,120,60,0.3)",
        boxShadow: "0 3px 12px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,230,170,0.08)",
      }}>

      {/* Title with wood grain feel */}
      <div className="text-center py-2.5 px-4"
        style={{
          background: "linear-gradient(90deg, #5a3d20, #6b4a2a, #5a3d20)",
          borderBottom: "2px solid rgba(160,120,60,0.3)",
          boxShadow: "inset 0 -1px 0 rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,230,170,0.1)",
        }}>
        <h3 className="font-extrabold text-xl sm:text-2xl lg:text-3xl tracking-wide"
          style={{ fontFamily: "'Frank Ruhl Libre', serif", color: "#ffe6a0", textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}>
          {item.title}
        </h3>
      </div>

      {/* Times */}
      <div className="px-5 sm:px-6 py-3 space-y-2">
        {times.map((time, i) => (
          <div key={i} className="flex items-baseline gap-2">
            {time.name ? (
              <>
                <span className="text-sm sm:text-base font-semibold shrink-0"
                  style={{ fontFamily: "'Frank Ruhl Libre', serif", color: "#c8a870" }}>
                  {time.name}
                </span>
                <span className="flex-1 border-b-2 border-dotted min-w-[16px] relative -top-1"
                  style={{ borderColor: "rgba(160,120,60,0.25)" }} />
                <span className="font-extrabold tabular-nums text-lg sm:text-xl lg:text-2xl shrink-0"
                  style={{ fontFamily: "'Frank Ruhl Libre', serif", color: "#ffe6a0" }}>
                  {time.computed}
                </span>
              </>
            ) : (
              <span className="font-extrabold tabular-nums text-lg sm:text-xl lg:text-2xl w-full text-center"
                style={{ fontFamily: "'Frank Ruhl Libre', serif", color: "#ffe6a0" }}>
                {time.computed}
              </span>
            )}
          </div>
        ))}
        {item.description && (
          <p className="text-xs sm:text-sm mt-2 text-center leading-relaxed font-medium"
            style={{ fontFamily: "'Frank Ruhl Libre', serif", color: "#a08860" }}>
            {item.description}
          </p>
        )}
      </div>
    </div>
  );
};

// ─── Column ──────────────────────────────────────────────────────────────────

const COL_LABELS = ["יום חול", "שבת קודש", "שיעורים"];

const WoodBlockColumn: React.FC<{
  blocks: Block[]; colIndex: number; location: KehilaLocation;
}> = ({ blocks, colIndex, location }) => {
  const now = useMemo(() => new Date(), []);
  const visible = blocks.filter((b) => isBlockVisible(b, now)).sort((a, b) => a.index - b.index);

  return (
    <div className="min-w-[86vw] sm:min-w-[58vw] lg:min-w-0 snap-start flex-shrink-0 lg:flex-shrink">
      <div className="text-center mb-3 py-2 rounded-md"
        style={{
          background: "linear-gradient(90deg, #5a3d20, #6b4a2a, #5a3d20)",
          border: "1px solid rgba(160,120,60,0.25)",
          boxShadow: "inset 0 1px 0 rgba(255,230,170,0.08)",
        }}>
        <span className="text-sm sm:text-base font-extrabold tracking-[0.2em]"
          style={{ fontFamily: "'Frank Ruhl Libre', serif", color: "#ffe6a0", textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}>
          {COL_LABELS[colIndex]}
        </span>
      </div>
      {visible.map((block) => {
        if (block.type === "times") {
          const c = block.content as TimesContent;
          return <WoodCard key={block.id} item={{ _id: block.id, title: c.title, times: c.times, description: c.description, index: block.index }} location={location} />;
        }
        return (
          <div key={block.id} className="mb-3 px-4 py-3 text-center rounded-md"
            style={{ color: "#ffe6a0", background: "rgba(62,42,26,0.9)", border: "1px solid rgba(160,120,60,0.2)" }}>
            <BlockRenderer block={block} location={location} />
          </div>
        );
      })}
    </div>
  );
};

// ─── Ticker ──────────────────────────────────────────────────────────────────

const WoodTicker: React.FC<{ text: string }> = ({ text }) => (
  <div className="overflow-hidden py-2.5"
    style={{
      background: "linear-gradient(90deg, #3a2510, #4d3318, #3a2510)",
      borderTop: "2px solid rgba(160,120,60,0.3)",
      boxShadow: "inset 0 1px 0 rgba(255,230,170,0.05)",
    }}>
    <div className="flex whitespace-nowrap">
      {[0, 1, 2].map((i) => (
        <span key={i} className="animate-ticker text-sm sm:text-base font-bold px-8 shrink-0 tracking-wide"
          style={{ fontFamily: "'Frank Ruhl Libre', serif", color: "#d4b87a" }}>
          {text}
        </span>
      ))}
    </div>
  </div>
);

// ─── Template ────────────────────────────────────────────────────────────────

export const WoodTemplate: React.FC<TemplateProps> = ({
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
  ].join("   ✦   ");

  const annText = active.length > 0
    ? active.map((a) => `${a.type === "simcha" ? "🎊" : a.type === "avel" ? "🕯️" : "📢"} ${a.text}`).join("   ✦   ")
    : null;
  const tickerText = annText ? `${annText}   ✦   ${zmanimText}` : zmanimText;

  return (
    <div className="relative w-full h-screen overflow-hidden" dir="rtl"
      style={{ background: "linear-gradient(160deg, #2a1a0c 0%, #3a2510 30%, #2f1c0e 60%, #241508 100%)" }}>

      {/* Wood grain texture */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.02 0.8' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }} />

      {/* Corner ornaments */}
      <div className="absolute top-4 right-4 w-16 h-16 opacity-20 pointer-events-none"
        style={{ borderRight: "2px solid #c8a870", borderTop: "2px solid #c8a870", borderRadius: "0 8px 0 0" }} />
      <div className="absolute top-4 left-4 w-16 h-16 opacity-20 pointer-events-none"
        style={{ borderLeft: "2px solid #c8a870", borderTop: "2px solid #c8a870", borderRadius: "8px 0 0 0" }} />
      <div className="absolute bottom-16 right-4 w-16 h-16 opacity-20 pointer-events-none"
        style={{ borderRight: "2px solid #c8a870", borderBottom: "2px solid #c8a870", borderRadius: "0 0 8px 0" }} />
      <div className="absolute bottom-16 left-4 w-16 h-16 opacity-20 pointer-events-none"
        style={{ borderLeft: "2px solid #c8a870", borderBottom: "2px solid #c8a870", borderRadius: "0 0 0 8px" }} />

      <div className="relative z-10 flex flex-col h-screen pb-12">

        {/* ── Header ── */}
        <header className="text-center pt-6 sm:pt-8 pb-4 px-6">
          {kehila.logoUrl && (
            <img src={kehila.logoUrl} alt="לוגו" className="mx-auto h-14 sm:h-18 mb-3 object-contain drop-shadow-lg" />
          )}

          <h1 className="font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-widest"
            style={{
              fontFamily: "'Frank Ruhl Libre', serif",
              color: "#ffe6a0",
              textShadow: "0 2px 8px rgba(0,0,0,0.4)",
            }}>
            {kehila.name}
          </h1>

          <p className="text-sm mt-1 tracking-widest font-medium"
            style={{ fontFamily: "'Frank Ruhl Libre', serif", color: "#a08860" }}>
            {kehila.city}
          </p>

          {/* Ornamental divider */}
          <div className="flex items-center justify-center gap-3 mt-3 mb-2">
            <span className="h-px w-14 sm:w-24" style={{ background: "linear-gradient(to right, transparent, #c8a870)" }} />
            <span style={{ color: "#c8a870", fontSize: "12px" }}>◆</span>
            <span className="h-px w-14 sm:w-24" style={{ background: "linear-gradient(to left, transparent, #c8a870)" }} />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 text-sm sm:text-lg">
            <span className="font-bold" style={{ fontFamily: "'Frank Ruhl Libre', serif", color: "#d4b87a" }}>
              {zmanim.hebrewDate}
            </span>
            {zmanim.parasha && (
              <>
                <span style={{ color: "rgba(200,168,112,0.3)" }}>|</span>
                <span className="font-semibold" style={{ fontFamily: "'Frank Ruhl Libre', serif", color: "#c8a870" }}>
                  {zmanim.parasha}
                </span>
              </>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-8 mt-2 text-sm sm:text-base">
            <span style={{ fontFamily: "'Frank Ruhl Libre', serif", color: "#a08860" }}>
              🕯️ הדלקת נרות: <strong style={{ color: "#ffe6a0" }}>{zmanim.candleLighting}</strong>
            </span>
            <span style={{ fontFamily: "'Frank Ruhl Libre', serif", color: "#a08860" }}>
              צאת שבת: <strong style={{ color: "#ffe6a0" }}>{zmanim.shabbatEnd}</strong>
            </span>
          </div>
        </header>

        {/* ── Announcements ── */}
        {active.length > 0 && (
          <div className="mx-6 sm:mx-16 mb-2 space-y-1.5">
            {active.map((a) => (
              <div key={a.id} className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold"
                style={{
                  background: "rgba(100,70,35,0.4)",
                  border: "1px solid rgba(160,120,60,0.25)",
                  color: "#d4b87a",
                  fontFamily: "'Frank Ruhl Libre', serif",
                }}>
                <span className="text-base shrink-0">{a.type === "simcha" ? "🎊" : a.type === "avel" ? "🕯️" : "📢"}</span>
                {a.text}
              </div>
            ))}
          </div>
        )}

        {/* ── Columns ── */}
        <main className="flex-1 px-3 sm:px-6 lg:px-14 overflow-hidden">
          <div className="flex lg:grid lg:grid-cols-3 overflow-x-auto snap-x snap-mandatory gap-3 sm:gap-4 lg:gap-6 pb-2 lg:overflow-hidden h-full">
            {useBlox
              ? [rightBlocks, middleBlocks, leftBlocks].map((col, ci) => (
                  <WoodBlockColumn key={ci} blocks={col} colIndex={ci} location={kehila.location} />
                ))
              : [itemsRight, itemsMiddle, itemsLeft].map((col, ci) => (
                  <div key={ci} className="min-w-[86vw] sm:min-w-[58vw] lg:min-w-0 snap-start flex-shrink-0 lg:flex-shrink">
                    <div className="text-center mb-3 py-2 rounded-md"
                      style={{ background: "linear-gradient(90deg, #5a3d20, #6b4a2a, #5a3d20)", border: "1px solid rgba(160,120,60,0.25)" }}>
                      <span className="text-sm sm:text-base font-extrabold tracking-[0.2em]"
                        style={{ fontFamily: "'Frank Ruhl Libre', serif", color: "#ffe6a0", textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}>
                        {COL_LABELS[ci]}
                      </span>
                    </div>
                    {col.sort((a, b) => a.index - b.index).map((item) => (
                      <WoodCard key={item._id} item={item} location={kehila.location} />
                    ))}
                  </div>
                ))
            }
          </div>
        </main>
      </div>

      {/* ── Ticker ── */}
      <div className="fixed bottom-0 left-0 right-0 z-20">
        <WoodTicker text={tickerText} />
      </div>
    </div>
  );
};
