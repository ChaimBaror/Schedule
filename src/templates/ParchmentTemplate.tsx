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

const ParchmentCard: React.FC<{
  item: Item;
  location: KehilaLocation;
  onEdit?: (item: Item) => void;
  isKiosk?: boolean;
}> = ({ item, location, onEdit, isKiosk }) => {
  const times = useMemo(
    () => item.times.map((t) => ({ ...t, computed: calcTime(t, location) })),
    [item, location]
  );

  return (
    <div className="group relative mb-3">
      {/* Title bar with golden row image */}
      <div
        className="bg-cover bg-center py-2 px-4 text-center"
        style={{ backgroundImage: `url("/assets/row.png")` }}
      >
        <h3
          className="font-extrabold text-xl sm:text-2xl lg:text-3xl tracking-wide"
          style={{
            fontFamily: "'Frank Ruhl Libre', 'David Libre', serif",
            color: "#1a0e00",
          }}
        >
          {item.title}
        </h3>
      </div>

      {/* Times list */}
      <div className="px-4 sm:px-6 py-3 space-y-2">
        {times.map((time, i) => (
          <div key={i} className="flex items-baseline gap-2">
            {time.name ? (
              <>
                <span
                  className="text-sm sm:text-lg font-semibold shrink-0"
                  style={{ fontFamily: "'Frank Ruhl Libre', serif", color: "#3d2800" }}
                >
                  {time.name}
                </span>
                <span className="flex-1 border-b-2 border-dotted min-w-[20px] relative -top-1" style={{ borderColor: "#8B691480" }} />
                <span
                  className="font-extrabold tabular-nums text-lg sm:text-xl lg:text-2xl shrink-0"
                  style={{ fontFamily: "'Frank Ruhl Libre', serif", color: "#1a0e00" }}
                >
                  {time.computed}
                </span>
              </>
            ) : (
              <span
                className="font-extrabold tabular-nums text-lg sm:text-xl lg:text-2xl w-full text-center"
                style={{ fontFamily: "'Frank Ruhl Libre', serif", color: "#1a0e00" }}
              >
                {time.computed}
              </span>
            )}
          </div>
        ))}

        {item.description && (
          <p
            className="text-xs sm:text-sm mt-2 leading-relaxed text-center font-medium"
            style={{ fontFamily: "'Frank Ruhl Libre', serif", color: "#4a3000" }}
          >
            {item.description}
          </p>
        )}
      </div>

      {/* Edit button */}
      {!isKiosk && onEdit && (
        <button
          aria-label="ערוך"
          onClick={() => onEdit(item)}
          className="absolute top-2 left-2 p-1.5 rounded bg-amber-800/20 text-amber-900 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-3.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" />
          </svg>
        </button>
      )}
    </div>
  );
};

// ─── Column labels ───────────────────────────────────────────────────────────

const COL_LABELS = ["יום חול", "שבת קודש", "שיעורים"];

// ─── Block column ────────────────────────────────────────────────────────────

const ParchmentBlockColumn: React.FC<{
  blocks: Block[];
  colIndex: number;
  location: KehilaLocation;
}> = ({ blocks, colIndex, location }) => {
  const now = useMemo(() => new Date(), []);
  const visible = blocks.filter((b) => isBlockVisible(b, now)).sort((a, b) => a.index - b.index);

  return (
    <div className="min-w-[86vw] sm:min-w-[58vw] lg:min-w-0 snap-start flex-shrink-0 lg:flex-shrink">
      {/* Column header */}
      <div
        className="bg-cover bg-center py-1.5 px-4 text-center mb-3"
        style={{ backgroundImage: `url("/assets/row.png")` }}
      >
        <span
          className="text-sm sm:text-lg font-extrabold tracking-[0.2em]"
          style={{ fontFamily: "'Frank Ruhl Libre', serif", color: "#1a0e00" }}
        >
          {COL_LABELS[colIndex]}
        </span>
      </div>
      {visible.map((block) => {
        if (block.type === "times") {
          const c = block.content as TimesContent;
          const fakeItem: Item = {
            _id: block.id,
            title: c.title,
            times: c.times,
            description: c.description,
            index: block.index,
          };
          return <ParchmentCard key={block.id} item={fakeItem} location={location} isKiosk />;
        }
        return (
          <div key={block.id} className="mb-3 px-4 py-3 text-center text-amber-950">
            <BlockRenderer block={block} location={location} />
          </div>
        );
      })}
    </div>
  );
};

// ─── Ticker ──────────────────────────────────────────────────────────────────

const ParchmentTicker: React.FC<{ text: string }> = ({ text }) => (
  <div
    className="overflow-hidden py-2.5"
    style={{
      background: "linear-gradient(90deg, #8B6914, #b8922e, #8B6914)",
      borderTop: "2px solid rgba(100,60,0,0.3)",
    }}
  >
    <div className="flex whitespace-nowrap">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="animate-ticker text-sm sm:text-base font-extrabold px-8 shrink-0 tracking-wide"
          style={{ fontFamily: "'Frank Ruhl Libre', serif", color: "#0f0800" }}
        >
          {text}
        </span>
      ))}
    </div>
  </div>
);

// ─── Template ────────────────────────────────────────────────────────────────

export const ParchmentTemplate: React.FC<TemplateProps> = ({
  kehila, itemsRight, itemsMiddle, itemsLeft,
  announcements, zmanim, isKiosk = false, onEdit, blocks,
}) => {
  const useBlocks = blocks && blocks.length > 0;
  const rightBlocks = useMemo(() => blocks?.filter((b) => b.col === "right") ?? [], [blocks]);
  const middleBlocks = useMemo(() => blocks?.filter((b) => b.col === "middle") ?? [], [blocks]);
  const leftBlocks = useMemo(() => blocks?.filter((b) => b.col === "left") ?? [], [blocks]);

  const active = announcements.filter((a) => !a.expiresAt || new Date(a.expiresAt) > new Date());
  const cols = [itemsRight, itemsMiddle, itemsLeft];

  const annText = active.length > 0
    ? active.map((a) => `${a.type === "simcha" ? "🎊" : a.type === "avel" ? "🕯️" : "📢"} ${a.text}`).join("   ✦   ")
    : null;

  const zmanimText = [
    `זריחה: ${zmanim.sunrise}`,
    `סוף ק"ש: ${zmanim.sofZmanShma}`,
    `חצות: ${zmanim.chatzot}`,
    `מנחה גדולה: ${zmanim.minchaGedola}`,
    `שקיעה: ${zmanim.shkiah}`,
    `הדלקת נרות: ${zmanim.candleLighting}`,
    `צאת שבת: ${zmanim.shabbatEnd}`,
  ].join("   ❧   ");

  const tickerText = annText ? `${annText}   ✦   ${zmanimText}` : zmanimText;

  return (
    <div className="relative w-full h-screen overflow-hidden" dir="rtl">
      {/* Background — parchment with candles */}
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url("/assets/dashboard-2.png")` }}
        />
      </div>

      <div className="relative z-10 flex flex-col h-screen pb-12">
        {/* ── Header ── */}
        <header className="text-center pt-5 sm:pt-8 pb-3 px-6 sm:px-16">
          {kehila.logoUrl && (
            <img
              src={kehila.logoUrl}
              alt="לוגו"
              className="mx-auto h-16 sm:h-20 mb-2 object-contain drop-shadow-md"
            />
          )}

          <h1
            className="font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-widest"
            style={{
              fontFamily: "'Frank Ruhl Libre', 'David Libre', serif",
              color: "#1a0e00",
            }}
          >
            {kehila.name}
          </h1>

          {/* Decorative divider */}
          <div className="flex items-center justify-center gap-3 mt-2 mb-1">
            <span className="h-px w-16 sm:w-24" style={{ background: "#8B691466" }} />
            <span style={{ color: "#5a3d00" }} className="text-sm">❧</span>
            <span className="h-px w-16 sm:w-24" style={{ background: "#8B691466" }} />
          </div>

          {/* Hebrew date + parasha */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-sm sm:text-lg">
            <span
              className="font-bold"
              style={{ fontFamily: "'Frank Ruhl Libre', serif", color: "#2d1a00" }}
            >
              {zmanim.hebrewDate}
            </span>
            {zmanim.parasha && (
              <>
                <span style={{ color: "#8B691466" }}>|</span>
                <span
                  className="font-semibold"
                  style={{ fontFamily: "'Frank Ruhl Libre', serif", color: "#3d2800" }}
                >
                  {zmanim.parasha}
                </span>
              </>
            )}
          </div>

          {/* Candle lighting + shabbat end */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-2 text-sm sm:text-base">
            <span className="font-semibold" style={{ fontFamily: "'Frank Ruhl Libre', serif", color: "#3d2800" }}>
              🕯️ הדלקת נרות: <strong style={{ color: "#1a0e00" }}>{zmanim.candleLighting}</strong>
            </span>
            <span style={{ color: "#8B691466" }}>|</span>
            <span className="font-semibold" style={{ fontFamily: "'Frank Ruhl Libre', serif", color: "#3d2800" }}>
              צאת שבת: <strong style={{ color: "#1a0e00" }}>{zmanim.shabbatEnd}</strong>
            </span>
          </div>
        </header>

        {/* ── Announcements ── */}
        {active.length > 0 && (
          <div className="mx-6 sm:mx-16 mb-2 space-y-1.5">
            {active.map((a) => (
              <div
                key={a.id}
                className="flex items-center gap-2 px-4 py-2 rounded-sm text-sm font-semibold border"
                style={{
                  background: "rgba(139,105,20,0.08)",
                  borderColor: "rgba(139,105,20,0.25)",
                  fontFamily: "'Frank Ruhl Libre', serif",
                  color: "#2d1a00",
                }}
              >
                <span className="text-base shrink-0">
                  {a.type === "simcha" ? "🎊" : a.type === "avel" ? "🕯️" : "📢"}
                </span>
                {a.text}
              </div>
            ))}
          </div>
        )}

        {/* ── Columns ── */}
        <main className="flex-1 px-4 sm:px-8 lg:px-20 overflow-hidden">
          <div className="flex lg:grid lg:grid-cols-3 overflow-x-auto snap-x snap-mandatory gap-3 sm:gap-4 lg:gap-6 pb-2 lg:overflow-hidden h-full">
            {useBlocks
              ? [rightBlocks, middleBlocks, leftBlocks].map((col, ci) => (
                  <ParchmentBlockColumn
                    key={ci}
                    blocks={col}
                    colIndex={ci}
                    location={kehila.location}
                  />
                ))
              : cols.map((colItems, ci) => (
                  <div key={ci} className="min-w-[86vw] sm:min-w-[58vw] lg:min-w-0 snap-start flex-shrink-0 lg:flex-shrink">
                    {/* Column header */}
                    <div
                      className="bg-cover bg-center py-1.5 px-4 text-center mb-3"
                      style={{ backgroundImage: `url("/assets/row.png")` }}
                    >
                      <span
                        className="text-amber-950/80 text-sm sm:text-base font-bold tracking-[0.2em]"
                        style={{ fontFamily: "'Frank Ruhl Libre', serif" }}
                      >
                        {COL_LABELS[ci]}
                      </span>
                    </div>
                    {colItems
                      .sort((a, b) => a.index - b.index)
                      .map((item) => (
                        <ParchmentCard
                          key={item._id}
                          item={item}
                          location={kehila.location}
                          onEdit={onEdit}
                          isKiosk={isKiosk}
                        />
                      ))}
                  </div>
                ))
            }
          </div>
        </main>

        {/* Scroll dots (mobile) */}
        <div className="flex justify-center gap-1.5 py-2 lg:hidden">
          {[0, 1, 2].map((i) => (
            <span key={i} className="w-1.5 h-1.5 rounded-full bg-amber-800/30" />
          ))}
        </div>
      </div>

      {/* ── Ticker (fixed bottom) ── */}
      <div className="fixed bottom-0 left-0 right-0 z-20">
        <ParchmentTicker text={tickerText} />
      </div>
    </div>
  );
};
