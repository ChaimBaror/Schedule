"use client";
import React, { useMemo } from "react";
import type { TemplateProps } from "./types";
import type { Item, Time } from "@/types/items";
import type { Block, ColumnPosition, TimesContent } from "@/types/block";
import {
  getZmanimForLocation,
  getCandleLightingForLocation,
  getDailyLearningDafYomi,
} from "@/services/hebcal.service";
import { formatTime, generateFiveMinutes } from "@/utils/utils";
import type { KehilaLocation } from "@/types/kehila";
import { BlockRenderer } from "@/components/BlockRenderers";
import { isBlockVisible } from "@/utils/block-visibility";
import { AutoScrollContainer } from "@/components/AutoScroll";
import { AutoPageColumns } from "@/components/AutoScroll";
import { Ticker } from "@/components/Ticker";
import { DEFAULT_DISPLAY_SETTINGS } from "@/types/kehila";

function calcTime(time: Time, location: KehilaLocation): string {
  if (!time.dynamic) return time.val;
  const z = getZmanimForLocation(location);
  const round = time.roundToFiveMinutes || time.rond5minet;
  switch (time.zman) {
    case "shkiah": {
      const t = round ? generateFiveMinutes(z.shkiah(), time.nimus || "0") : formatTime(z.shkiah(), time.nimus || "0");
      return time.val ? `${time.val} : ${t}` : t;
    }
    case "CandleLightingTime": {
      const t = formatTime(getCandleLightingForLocation(location), time.nimus || "0");
      return time.val ? `${time.val} : ${t}` : t;
    }
    case "getDailyLearningDafYomi":
      return getDailyLearningDafYomi();
    default:
      return time.val;
  }
}

// ─── Card ─────────────────────────────────────────────────────────────────────

const ClassicCard: React.FC<{
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
    <div className="group relative mb-2">
      {/* Title bar with decorative row image */}
      <div
        className="bg-cover bg-center py-1.5 px-3 text-xl sm:text-3xl lg:text-4xl font-bold text-center font-serif tracking-wide drop-shadow-sm"
        style={{ backgroundImage: `url("/assets/row.png")` }}
      >
        {item.title}
      </div>

      {/* Times */}
      <div className="bg-white/85 backdrop-blur-sm text-gray-900 py-3 sm:py-4 px-4 sm:px-6 font-semibold text-center text-base sm:text-lg lg:text-xl">
        {times.map((time, i) => (
          <div key={i} className="flex items-center justify-center w-full mb-2 last:mb-0">
            {time.name && (
              <>
                <span className="whitespace-nowrap text-sm sm:text-base text-gray-600">{time.name}</span>
                <span className="flex-grow border-t border-gray-300 mx-3" />
              </>
            )}
            <span className="whitespace-nowrap font-bold tabular-nums text-gray-900">{time.computed}</span>
          </div>
        ))}
        {item.description && (
          <p className="text-gray-500 text-xs sm:text-sm mt-3 font-normal leading-relaxed border-t border-gray-100 pt-2">
            {item.description}
          </p>
        )}
      </div>

      {/* Edit button */}
      {!isKiosk && onEdit && (
        <button
          aria-label="ערוך"
          className="absolute top-1.5 left-1.5 p-1.5 rounded-lg bg-black/30 hover:bg-black/50 text-white opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all"
          onClick={() => onEdit(item)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-3.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" />
          </svg>
        </button>
      )}
    </div>
  );
};

// ─── Column ───────────────────────────────────────────────────────────────────

const COL_LABELS = ["יום חול", "שבת קודש", "שיעורים"];

const ClassicColumnContent: React.FC<{
  items: Item[];
  colIndex: number;
  location: KehilaLocation;
  onEdit?: (item: Item) => void;
  isKiosk?: boolean;
}> = ({ items, colIndex, location, onEdit, isKiosk }) => (
  <>
    <div className="text-center mb-2 py-1">
      <span className="text-yellow-300/90 text-xs sm:text-sm font-semibold tracking-widest uppercase drop-shadow">
        {COL_LABELS[colIndex]}
      </span>
    </div>
    {items
      .sort((a, b) => a.index - b.index)
      .map((item) => (
        <ClassicCard key={item._id} item={item} location={location} onEdit={onEdit} isKiosk={isKiosk} />
      ))}
  </>
);

// ─── Block column content ────────────────────────────────────────────────────

const ClassicBlockColumnContent: React.FC<{
  blocks: Block[];
  colIndex: number;
  location: KehilaLocation;
}> = ({ blocks, colIndex, location }) => {
  const now = useMemo(() => new Date(), []);
  const visible = blocks.filter((b) => isBlockVisible(b, now)).sort((a, b) => a.index - b.index);

  return (
    <>
      <div className="text-center mb-2 py-1">
        <span className="text-yellow-300/90 text-xs sm:text-sm font-semibold tracking-widest uppercase drop-shadow">
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
          return <ClassicCard key={block.id} item={fakeItem} location={location} isKiosk />;
        }
        return (
          <div key={block.id} className="group relative mb-2">
            <div className="bg-white/85 backdrop-blur-sm text-gray-900 py-3 sm:py-4 px-4 sm:px-6 text-center rounded-sm">
              <BlockRenderer block={block} location={location} />
            </div>
          </div>
        );
      })}
    </>
  );
};

// ─── Template ─────────────────────────────────────────────────────────────────

export const ClassicTemplate: React.FC<TemplateProps> = ({
  kehila, itemsRight, itemsMiddle, itemsLeft,
  announcements, zmanim, isKiosk = false, onEdit, blocks, displaySettings,
}) => {
  const ds = displaySettings ?? DEFAULT_DISPLAY_SETTINGS;
  const useBlox = blocks && blocks.length > 0;
  const rightBlocks = useMemo(() => blocks?.filter((b) => b.col === "right") ?? [], [blocks]);
  const middleBlocks = useMemo(() => blocks?.filter((b) => b.col === "middle") ?? [], [blocks]);
  const leftBlocks = useMemo(() => blocks?.filter((b) => b.col === "left") ?? [], [blocks]);
  const activeAnn = announcements.filter((a) => !a.expiresAt || new Date(a.expiresAt) > new Date());

  // Build ticker items
  const tickerItems: string[] = [];
  if (activeAnn.length > 0) {
    activeAnn.forEach((a) => {
      tickerItems.push(`${a.type === "simcha" ? "🎊" : a.type === "avel" ? "🕯️" : "📢"} ${a.text}`);
    });
  }
  tickerItems.push(
    `זריחה: ${zmanim.sunrise}`,
    `סוף ק"ש: ${zmanim.sofZmanShma}`,
    `חצות: ${zmanim.chatzot}`,
    `מנחה גדולה: ${zmanim.minchaGedola}`,
    `שקיעה: ${zmanim.shkiah}`,
    `הדלקת נרות: ${zmanim.candleLighting}`,
    `צאת שבת: ${zmanim.shabbatEnd}`,
  );

  // Build column nodes for auto-paging on mobile
  const columnNodes = useBlox
    ? [rightBlocks, middleBlocks, leftBlocks].map((col, ci) => (
        <ClassicBlockColumnContent key={ci} blocks={col} colIndex={ci} location={kehila.location} />
      ))
    : [itemsRight, itemsMiddle, itemsLeft].map((col, ci) => (
        <ClassicColumnContent key={ci} items={col} colIndex={ci} location={kehila.location} onEdit={onEdit} isKiosk={isKiosk} />
      ));

  return (
    <div className="relative w-full h-screen overflow-hidden" dir="rtl">

      {/* Background image with dark overlay */}
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url("/assets/dashboard-2.png")` }}
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className="relative z-10 flex flex-col h-screen pb-12">

        {/* ── Header ── */}
        <header className="text-center pt-4 sm:pt-6 pb-3 px-4">
          {kehila.logoUrl && (
            <img src={kehila.logoUrl} alt="לוגו" className="mx-auto h-14 mb-3 object-contain drop-shadow-lg" />
          )}

          <h1 className="text-white font-bold text-2xl sm:text-3xl lg:text-5xl font-serif drop-shadow-lg tracking-wide">
            {kehila.name}
          </h1>

          {/* Decorative divider */}
          <div className="flex items-center justify-center gap-3 mt-1.5 mb-2">
            <span className="h-px w-12 sm:w-20 bg-yellow-400/60" />
            <span className="text-yellow-400 text-sm">✦</span>
            <span className="h-px w-12 sm:w-20 bg-yellow-400/60" />
          </div>

          {/* Hebrew date + parasha */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-sm sm:text-base">
            <span className="text-yellow-200 font-medium">{zmanim.hebrewDate}</span>
            {zmanim.parasha && (
              <span className="bg-yellow-500/20 border border-yellow-400/40 text-yellow-200 px-2.5 py-0.5 rounded-full text-xs sm:text-sm font-semibold">
                {zmanim.parasha}
              </span>
            )}
          </div>

          {/* Candle lighting pill */}
          <div className="flex items-center justify-center gap-3 mt-2 text-xs sm:text-sm flex-wrap">
            <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-3 py-1 rounded-full">
              🕯️ <span className="font-semibold">הדלקת נרות: {zmanim.candleLighting}</span>
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-3 py-1 rounded-full">
              ✨ <span className="font-semibold">צאת שבת: {zmanim.shabbatEnd}</span>
            </span>
          </div>
        </header>

        {/* ── Announcements banner (if any) ── */}
        {activeAnn.length > 0 && (
          <div className="mx-3 sm:mx-6 mb-3 space-y-1.5">
            {activeAnn.map((a) => (
              <div
                key={a.id}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium backdrop-blur-sm border ${
                  a.type === "simcha" ? "bg-yellow-400/20 border-yellow-400/40 text-yellow-100" :
                  a.type === "avel"   ? "bg-gray-400/20 border-gray-300/30 text-gray-100" :
                                        "bg-blue-400/20 border-blue-300/30 text-blue-100"
                }`}
              >
                <span className="text-base shrink-0">{a.type === "simcha" ? "🎊" : a.type === "avel" ? "🕯️" : "📢"}</span>
                {a.text}
              </div>
            ))}
          </div>
        )}

        {/* ── Columns (desktop) — auto-scroll if overflow ── */}
        <main className="flex-1 px-2 sm:px-4 lg:px-12 overflow-hidden">
          {/* Desktop */}
          <div className="hidden lg:block h-full">
            {ds.desktopLayout === "auto-page" ? (
              <AutoPageColumns
                columns={columnNodes}
                labels={COL_LABELS}
                interval={ds.desktopPageInterval}
                transitionDuration={ds.mobileTransitionDuration}
                showDots
                dotClassName="bg-white/25 hover:bg-white/40"
                activeDotClassName="bg-yellow-400/80"
                className="h-full"
              />
            ) : (
              <div className="grid grid-cols-3 gap-5 h-full">
                {columnNodes.map((node, ci) => (
                  ds.columnScrollMode === "none"
                    ? <div key={ci} className="h-full overflow-hidden">{node}</div>
                    : <AutoScrollContainer
                        key={ci}
                        speed={ds.columnScrollSpeed}
                        pauseAtEdge={ds.columnPauseAtEdge}
                        mode={ds.columnScrollMode}
                        className="h-full relative"
                      >
                        {node}
                      </AutoScrollContainer>
                ))}
              </div>
            )}
          </div>

          {/* Mobile/tablet: auto-page between columns */}
          <div className="lg:hidden h-full">
            <AutoPageColumns
              columns={columnNodes}
              labels={COL_LABELS}
              interval={ds.mobilePageInterval || 8000}
              transitionDuration={ds.mobileTransitionDuration}
              showDots
              dotClassName="bg-white/25 hover:bg-white/40"
              activeDotClassName="bg-yellow-400/80"
              className="h-full"
            />
          </div>
        </main>
      </div>

      {/* ── Ticker (fixed to bottom) ── */}
      <div className="fixed bottom-0 left-0 right-0 z-20">
        <Ticker
          items={tickerItems}
          separator="   🔹   "
          speed={ds.tickerSpeed}
          pauseOnHover={ds.tickerPauseOnHover}
          className="bg-gradient-to-r from-yellow-800 via-[#AE8D3E] to-yellow-800 py-2.5 border-t-2 border-yellow-600/50"
          textClassName="text-sm sm:text-base lg:text-lg font-bold"
          textStyle={{ color: "#1a0e00" }}
        />
      </div>
    </div>
  );
};
