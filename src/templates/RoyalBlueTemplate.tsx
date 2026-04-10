"use client";
import React, { useMemo } from "react";
import type { TemplateProps } from "./types";
import type { Item } from "@/types/items";
import type { Block, TimesContent } from "@/types/block";
import { calcTime } from "./calcTime";
import type { KehilaLocation } from "@/types/kehila";
import { BlockRenderer } from "@/components/BlockRenderers";
import { isBlockVisible } from "@/utils/block-visibility";

// ─── Decorative arch SVG ─────────────────────────────────────────────────────

const ArchDecoration = () => (
  <svg viewBox="0 0 400 40" className="w-48 sm:w-64 mx-auto opacity-40" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 35 Q200 0 380 35" fill="none" stroke="#c9a84c" strokeWidth="1.5" />
    <path d="M40 35 Q200 8 360 35" fill="none" stroke="#c9a84c" strokeWidth="0.8" />
    <circle cx="200" cy="5" r="3" fill="#c9a84c" opacity="0.6" />
    <circle cx="160" cy="12" r="1.5" fill="#c9a84c" opacity="0.4" />
    <circle cx="240" cy="12" r="1.5" fill="#c9a84c" opacity="0.4" />
  </svg>
);

// ─── Card ────────────────────────────────────────────────────────────────────

const RoyalCard: React.FC<{ item: Item; location: KehilaLocation }> = ({ item, location }) => {
  const times = useMemo(
    () => item.times.map((t) => ({ ...t, computed: calcTime(t, location) })),
    [item, location]
  );

  return (
    <div className="mb-3 rounded-lg overflow-hidden"
      style={{
        background: "linear-gradient(180deg, rgba(15,25,60,0.9) 0%, rgba(10,18,45,0.95) 100%)",
        border: "1px solid rgba(201,168,76,0.25)",
        boxShadow: "0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(201,168,76,0.1)",
      }}
    >
      {/* Title */}
      <div className="text-center py-2.5 px-4 relative"
        style={{
          background: "linear-gradient(90deg, rgba(201,168,76,0.05), rgba(201,168,76,0.15), rgba(201,168,76,0.05))",
          borderBottom: "1px solid rgba(201,168,76,0.2)",
        }}
      >
        <h3 className="font-bold text-xl sm:text-2xl lg:text-3xl tracking-wide"
          style={{ fontFamily: "'Frank Ruhl Libre', serif", color: "#d4af5a" }}
        >
          {item.title}
        </h3>
      </div>

      {/* Times */}
      <div className="px-5 sm:px-6 py-3 space-y-2">
        {times.map((time, i) => (
          <div key={i} className="flex items-baseline gap-2">
            {time.name ? (
              <>
                <span className="text-sm sm:text-base font-medium shrink-0"
                  style={{ fontFamily: "'Frank Ruhl Libre', serif", color: "#8a9cc7" }}>
                  {time.name}
                </span>
                <span className="flex-1 border-b border-dotted min-w-[16px] relative -top-1"
                  style={{ borderColor: "rgba(201,168,76,0.2)" }} />
                <span className="font-bold tabular-nums text-lg sm:text-xl lg:text-2xl shrink-0"
                  style={{ fontFamily: "'Frank Ruhl Libre', serif", color: "#e8d9a8" }}>
                  {time.computed}
                </span>
              </>
            ) : (
              <span className="font-bold tabular-nums text-lg sm:text-xl lg:text-2xl w-full text-center"
                style={{ fontFamily: "'Frank Ruhl Libre', serif", color: "#e8d9a8" }}>
                {time.computed}
              </span>
            )}
          </div>
        ))}
        {item.description && (
          <p className="text-xs sm:text-sm mt-2 text-center leading-relaxed"
            style={{ fontFamily: "'Frank Ruhl Libre', serif", color: "#7a8ab5" }}>
            {item.description}
          </p>
        )}
      </div>
    </div>
  );
};

// ─── Column ──────────────────────────────────────────────────────────────────

const COL_LABELS = ["יום חול", "שבת קודש", "שיעורים ומוסר"];

const RoyalBlockColumn: React.FC<{
  blocks: Block[]; colIndex: number; location: KehilaLocation;
}> = ({ blocks, colIndex, location }) => {
  const now = useMemo(() => new Date(), []);
  const visible = blocks.filter((b) => isBlockVisible(b, now)).sort((a, b) => a.index - b.index);

  return (
    <div className="min-w-[86vw] sm:min-w-[58vw] lg:min-w-0 snap-start flex-shrink-0 lg:flex-shrink">
      <div className="text-center mb-3 py-2 rounded-lg"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.12), transparent)",
          borderBottom: "1px solid rgba(201,168,76,0.2)",
        }}>
        <span className="text-sm sm:text-base font-bold tracking-[0.25em]"
          style={{ fontFamily: "'Frank Ruhl Libre', serif", color: "#c9a84c" }}>
          {COL_LABELS[colIndex]}
        </span>
      </div>
      {visible.map((block) => {
        if (block.type === "times") {
          const c = block.content as TimesContent;
          return <RoyalCard key={block.id} item={{ _id: block.id, title: c.title, times: c.times, description: c.description, index: block.index }} location={location} />;
        }
        return (
          <div key={block.id} className="mb-3 px-4 py-3 text-center rounded-lg"
            style={{ color: "#c9b580", background: "rgba(15,25,60,0.8)", border: "1px solid rgba(201,168,76,0.15)" }}>
            <BlockRenderer block={block} location={location} />
          </div>
        );
      })}
    </div>
  );
};

// ─── Ticker ──────────────────────────────────────────────────────────────────

const RoyalTicker: React.FC<{ text: string }> = ({ text }) => (
  <div className="overflow-hidden py-2.5"
    style={{
      background: "linear-gradient(90deg, #0a1235, #152050, #0a1235)",
      borderTop: "1px solid rgba(201,168,76,0.3)",
    }}>
    <div className="flex whitespace-nowrap">
      {[0, 1, 2].map((i) => (
        <span key={i} className="animate-ticker text-sm sm:text-base font-bold px-8 shrink-0 tracking-wide"
          style={{ fontFamily: "'Frank Ruhl Libre', serif", color: "#c9a84c" }}>
          {text}
        </span>
      ))}
    </div>
  </div>
);

// ─── Template ────────────────────────────────────────────────────────────────

export const RoyalBlueTemplate: React.FC<TemplateProps> = ({
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
      style={{ background: "linear-gradient(160deg, #050a1e 0%, #0c1535 30%, #0a1030 60%, #060c22 100%)" }}>

      {/* Subtle radial glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 20%, rgba(201,168,76,0.06) 0%, transparent 60%)" }} />

      {/* Vertical gold lines on sides */}
      <div className="absolute top-0 bottom-0 right-6 w-px opacity-15"
        style={{ background: "linear-gradient(180deg, transparent, #c9a84c, transparent)" }} />
      <div className="absolute top-0 bottom-0 left-6 w-px opacity-15"
        style={{ background: "linear-gradient(180deg, transparent, #c9a84c, transparent)" }} />

      <div className="relative z-10 flex flex-col h-screen pb-12">

        {/* ── Header ── */}
        <header className="text-center pt-5 sm:pt-8 pb-3 px-6">
          {kehila.logoUrl && (
            <img src={kehila.logoUrl} alt="לוגו" className="mx-auto h-14 sm:h-18 mb-3 object-contain drop-shadow-lg" />
          )}

          <ArchDecoration />

          <h1 className="font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-widest mt-2"
            style={{ fontFamily: "'Frank Ruhl Libre', serif", color: "#d4af5a", textShadow: "0 2px 12px rgba(201,168,76,0.2)" }}>
            {kehila.name}
          </h1>

          <div className="flex items-center justify-center gap-4 mt-3 mb-1">
            <span className="h-px w-12 sm:w-20" style={{ background: "linear-gradient(to right, transparent, rgba(201,168,76,0.4))" }} />
            <span style={{ color: "#c9a84c" }} className="text-xs">✡</span>
            <span className="h-px w-12 sm:w-20" style={{ background: "linear-gradient(to left, transparent, rgba(201,168,76,0.4))" }} />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 text-sm sm:text-lg">
            <span className="font-bold" style={{ fontFamily: "'Frank Ruhl Libre', serif", color: "#8a9cc7" }}>
              {zmanim.hebrewDate}
            </span>
            {zmanim.parasha && (
              <>
                <span style={{ color: "rgba(201,168,76,0.3)" }}>|</span>
                <span className="font-semibold" style={{ fontFamily: "'Frank Ruhl Libre', serif", color: "#a0b0d8" }}>
                  {zmanim.parasha}
                </span>
              </>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mt-2 text-sm sm:text-base">
            <span style={{ fontFamily: "'Frank Ruhl Libre', serif", color: "#7a8ab5" }}>
              🕯️ הדלקת נרות: <strong style={{ color: "#d4af5a" }}>{zmanim.candleLighting}</strong>
            </span>
            <span style={{ fontFamily: "'Frank Ruhl Libre', serif", color: "#7a8ab5" }}>
              צאת שבת: <strong style={{ color: "#d4af5a" }}>{zmanim.shabbatEnd}</strong>
            </span>
          </div>
        </header>

        {/* ── Announcements ── */}
        {active.length > 0 && (
          <div className="mx-6 sm:mx-16 mb-2 space-y-1.5">
            {active.map((a) => (
              <div key={a.id} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
                style={{
                  background: a.type === "simcha" ? "rgba(201,168,76,0.1)" : a.type === "avel" ? "rgba(150,150,180,0.1)" : "rgba(100,140,220,0.1)",
                  border: `1px solid ${a.type === "simcha" ? "rgba(201,168,76,0.25)" : a.type === "avel" ? "rgba(150,150,180,0.2)" : "rgba(100,140,220,0.2)"}`,
                  color: "#b0bfe0",
                  fontFamily: "'Frank Ruhl Libre', serif",
                }}>
                <span className="text-base shrink-0">{a.type === "simcha" ? "🎊" : a.type === "avel" ? "🕯️" : "📢"}</span>
                {a.text}
              </div>
            ))}
          </div>
        )}

        {/* ── Columns ── */}
        <main className="flex-1 px-3 sm:px-6 lg:px-16 overflow-hidden">
          <div className="flex lg:grid lg:grid-cols-3 overflow-x-auto snap-x snap-mandatory gap-3 sm:gap-4 lg:gap-6 pb-2 lg:overflow-hidden h-full">
            {useBlox
              ? [rightBlocks, middleBlocks, leftBlocks].map((col, ci) => (
                  <RoyalBlockColumn key={ci} blocks={col} colIndex={ci} location={kehila.location} />
                ))
              : [itemsRight, itemsMiddle, itemsLeft].map((col, ci) => (
                  <div key={ci} className="min-w-[86vw] sm:min-w-[58vw] lg:min-w-0 snap-start flex-shrink-0 lg:flex-shrink">
                    <div className="text-center mb-3 py-2 rounded-lg"
                      style={{ background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.12), transparent)", borderBottom: "1px solid rgba(201,168,76,0.2)" }}>
                      <span className="text-sm sm:text-base font-bold tracking-[0.25em]"
                        style={{ fontFamily: "'Frank Ruhl Libre', serif", color: "#c9a84c" }}>
                        {COL_LABELS[ci]}
                      </span>
                    </div>
                    {col.sort((a, b) => a.index - b.index).map((item) => (
                      <RoyalCard key={item._id} item={item} location={kehila.location} />
                    ))}
                  </div>
                ))
            }
          </div>
        </main>
      </div>

      {/* ── Ticker ── */}
      <div className="fixed bottom-0 left-0 right-0 z-20">
        <RoyalTicker text={tickerText} />
      </div>
    </div>
  );
};
