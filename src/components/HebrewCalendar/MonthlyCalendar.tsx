"use client";
import React, { useMemo, useState, useEffect } from "react";
import { HDate, HebrewCalendar, Zmanim, GeoLocation, DailyLearning } from "@hebcal/core";
import "@hebcal/learning";
import { DEFAULT_LOCATION, CITIES } from "@/services/hebcal.service";
import type { KehilaLocation } from "@/types/kehila";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CalendarDay {
  gregDate: Date;
  hDate: HDate;
  hebrewLabel: string;
  gregLabel: string;
  dayOfWeek: number;
  isShabbat: boolean;
  isFriday: boolean;
  isToday: boolean;
  sunrise: string;
  sunset: string;
  dafYomi: string;
  events: string[];
  isYomTov: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(d: Date): string {
  return d.toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" });
}

function getDafYomi(hd: HDate): string {
  try {
    const ev = DailyLearning.lookup("dafYomi", hd);
    return ev ? ev.render("he") : "";
  } catch {
    return "";
  }
}

const YOM_TOV_KEYWORDS = ["ראש השנה", "יום כיפור", "סוכות", "שמחת תורה", "פסח", "שבועות", "פורים", "חנוכה"];

function getEventsForDay(gregDate: Date): { events: string[]; isYomTov: boolean } {
  const events = HebrewCalendar.calendar({
    start: new HDate(gregDate),
    end: new HDate(gregDate),
    il: true,
    addHebrewDates: false,
    shabbatMevarchim: true,
    sedrot: true,
    omer: true,
    noModern: false,
  });
  const filtered = events
    .filter((e) => !e.getDesc().startsWith("Hebrew"))
    .map((e) => e.render("he"));
  const isYomTov = filtered.some((e) => YOM_TOV_KEYWORDS.some((k) => e.includes(k)));
  return { events: filtered, isYomTov };
}

function buildDay(gregDate: Date, location: KehilaLocation, todayStr: string): CalendarDay {
  const hd = new HDate(gregDate);
  const geo = new GeoLocation(null, location.lat, location.lng, 0, location.tzid);
  const z = new Zmanim(geo, gregDate, false);
  const { events, isYomTov } = getEventsForDay(gregDate);
  return {
    gregDate,
    hDate: hd,
    hebrewLabel: hd.renderGematriya(),
    gregLabel: gregDate.getDate().toString(),
    dayOfWeek: gregDate.getDay(),
    isShabbat: gregDate.getDay() === 6,
    isFriday: gregDate.getDay() === 5,
    isToday: gregDate.toDateString() === todayStr,
    sunrise: fmt(z.sunrise()),
    sunset: fmt(z.shkiah()),
    dafYomi: getDafYomi(hd),
    events,
    isYomTov,
  };
}

function getHebrewMonthName(month: number, year: number): string {
  const names: Record<number, string> = {
    1: "ניסן", 2: "אייר", 3: "סיוון", 4: "תמוז", 5: "אב", 6: "אלול",
    7: "תשרי", 8: "חשוון", 9: "כסלו", 10: "טבת", 11: "שבט",
    12: "אדר", 13: "אדר ב׳",
  };
  if (HDate.isLeapYear(year) && month === 12) return "אדר א׳";
  return names[month] ?? "";
}

function hebrewYearLabel(year: number): string {
  return new HDate(1, 7, year).renderGematriya().split(" ").slice(-1)[0] ?? String(year);
}

function prevHebrewMonth(m: number, y: number) {
  return m === 1 ? { month: HDate.monthsInYear(y - 1), year: y - 1 } : { month: m - 1, year: y };
}
function nextHebrewMonth(m: number, y: number) {
  const max = HDate.monthsInYear(y);
  return m === max ? { month: 1, year: y + 1 } : { month: m + 1, year: y };
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const SunriseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="size-3 shrink-0">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1M4.22 4.22l.7.7m12.16 12.16.7.7M1 12h1m20 0h1M4.22 19.78l.7-.7M18.36 5.64l.7-.7M12 7a5 5 0 1 1 0 10A5 5 0 0 1 12 7z"/>
    <path strokeLinecap="round" d="M5 19h14"/>
  </svg>
);

const SunsetIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="size-3 shrink-0">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7a5 5 0 1 1 0 10A5 5 0 0 1 12 7z"/>
    <path strokeLinecap="round" d="M5 19h14M12 3v1M4.22 4.22l.7.7m12.16 12.16.7.7M1 12h1m20 0h1M4.22 19.78l.7-.7M18.36 5.64l.7-.7"/>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 22l4-3 4 3"/>
  </svg>
);

const ChevronRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
  </svg>
);
const ChevronLeft = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 19.5-7.5-7.5 7.5-7.5" />
  </svg>
);

// ─── DayCell ─────────────────────────────────────────────────────────────────

const DAY_HEADERS = ["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "שבת"];

function DayCell({ day, onClick }: { day: CalendarDay; onClick: (d: CalendarDay) => void }) {
  const bg = day.isToday
    ? "bg-blue-600 text-white shadow-lg shadow-blue-200 scale-[1.02]"
    : day.isShabbat
    ? "bg-gradient-to-b from-indigo-50 to-indigo-100/60 hover:from-indigo-100 hover:to-indigo-200/60"
    : day.isYomTov
    ? "bg-gradient-to-b from-amber-50 to-yellow-50 hover:from-amber-100"
    : day.isFriday
    ? "bg-gradient-to-b from-violet-50 to-purple-50/40 hover:from-violet-100"
    : "bg-white hover:bg-gray-50";

  const borderColor = day.isToday
    ? "border-blue-500"
    : day.isShabbat
    ? "border-indigo-200"
    : day.isYomTov
    ? "border-amber-300"
    : "border-gray-100";

  return (
    <button
      onClick={() => onClick(day)}
      className={`
        group relative flex flex-col items-stretch text-right p-1.5 sm:p-2 rounded-2xl border
        transition-all duration-150 ease-out
        min-h-[72px] sm:min-h-[96px] lg:min-h-[118px]
        active:scale-95 cursor-pointer
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1
        ${bg} ${borderColor}
      `}
    >
      {/* Hebrew date */}
      <span className={`font-bold leading-tight text-[11px] sm:text-sm lg:text-base ${day.isToday ? "text-white" : day.isShabbat ? "text-indigo-700" : day.isYomTov ? "text-amber-700" : "text-gray-800"}`}>
        {day.hebrewLabel}
      </span>

      {/* Gregorian date */}
      <span className={`text-[10px] sm:text-xs mt-0.5 font-medium ${day.isToday ? "text-blue-100" : "text-gray-400"}`}>
        {day.gregLabel}
      </span>

      {/* Event chip */}
      {day.events.length > 0 && (
        <div className="mt-1 flex flex-col gap-0.5">
          {day.events.slice(0, 1).map((e, i) => (
            <span
              key={i}
              className={`text-[8px] sm:text-[10px] font-semibold truncate leading-tight rounded px-0.5
                ${day.isToday ? "text-yellow-200" : day.isYomTov ? "text-amber-700" : "text-amber-600"}`}
            >
              {e}
            </span>
          ))}
          {day.events.length > 1 && (
            <span className={`text-[8px] ${day.isToday ? "text-blue-200" : "text-gray-400"}`}>
              +{day.events.length - 1}
            </span>
          )}
        </div>
      )}

      {/* Zmanim — sm+ */}
      <div className="hidden sm:flex flex-col mt-auto gap-0.5 pt-1">
        <span className={`flex items-center gap-0.5 text-[9px] sm:text-[10px] tabular-nums font-medium
          ${day.isToday ? "text-orange-200" : "text-orange-500"}`}>
          <SunriseIcon />
          {day.sunrise}
        </span>
        <span className={`flex items-center gap-0.5 text-[9px] sm:text-[10px] tabular-nums font-medium
          ${day.isToday ? "text-purple-200" : "text-purple-500"}`}>
          <SunsetIcon />
          {day.sunset}
        </span>
      </div>

      {/* Daf Yomi — lg+ */}
      {day.dafYomi && (
        <span className={`hidden lg:block text-[9px] truncate mt-0.5 font-medium
          ${day.isToday ? "text-teal-200" : "text-teal-600"}`}>
          📖 {day.dafYomi}
        </span>
      )}

      {/* Hover reveal dot */}
      <span className={`absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity
        ${day.isToday ? "bg-white" : "bg-blue-400"}`} />
    </button>
  );
}

// ─── DayDetail Modal ──────────────────────────────────────────────────────────

const DAY_OF_WEEK_HE = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת קודש"];

function DayDetail({ day, onClose }: { day: CalendarDay; onClose: () => void }) {
  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const accentBg = day.isShabbat
    ? "from-indigo-600 to-violet-700"
    : day.isYomTov
    ? "from-amber-500 to-orange-600"
    : day.isToday
    ? "from-blue-600 to-indigo-600"
    : "from-gray-700 to-gray-900";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:max-w-sm rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 duration-200"
        dir="rtl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Colored header */}
        <div className={`bg-gradient-to-br ${accentBg} px-5 pt-5 pb-6 text-white`}>
          <div className="flex items-start justify-between mb-1">
            <div>
              <p className="text-white/70 text-sm font-medium">יום {DAY_OF_WEEK_HE[day.dayOfWeek]}</p>
              <h3 className="font-bold text-3xl mt-0.5">{day.hebrewLabel}</h3>
            </div>
            <button
              onClick={onClose}
              className="mt-0.5 p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              aria-label="סגור"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-white/60 text-xs">
            {day.gregDate.toLocaleDateString("he-IL", { day: "numeric", month: "long", year: "numeric" })}
          </p>

          {/* Events in header */}
          {day.events.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {day.events.map((e, i) => (
                <span key={i} className="text-xs font-semibold bg-white/20 rounded-full px-2.5 py-0.5">
                  {e}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-3">
          {/* Zmanim */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-3 bg-orange-50 border border-orange-100 rounded-2xl p-3">
              <div className="bg-orange-100 rounded-xl p-2 text-orange-500 shrink-0">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="size-5">
                  <circle cx="12" cy="12" r="4" />
                  <path strokeLinecap="round" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
                  <path strokeLinecap="round" d="M3 20h18"/>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 20c0-2.761 2.239-5 5-5s5 2.239 5 5"/>
                </svg>
              </div>
              <div>
                <p className="text-orange-400 text-xs font-medium">זריחה</p>
                <p className="font-bold text-orange-700 text-xl tabular-nums">{day.sunrise}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-purple-50 border border-purple-100 rounded-2xl p-3">
              <div className="bg-purple-100 rounded-xl p-2 text-purple-500 shrink-0">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="size-5">
                  <circle cx="12" cy="12" r="4" />
                  <path strokeLinecap="round" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
                  <path strokeLinecap="round" d="M3 20h18"/>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 22l4-2 4 2"/>
                </svg>
              </div>
              <div>
                <p className="text-purple-400 text-xs font-medium">שקיעה</p>
                <p className="font-bold text-purple-700 text-xl tabular-nums">{day.sunset}</p>
              </div>
            </div>
          </div>

          {/* Daf Yomi */}
          {day.dafYomi && (
            <div className="flex items-center gap-3 bg-teal-50 border border-teal-100 rounded-2xl p-3">
              <div className="bg-teal-100 rounded-xl p-2 text-teal-600 shrink-0 text-lg leading-none">📖</div>
              <div>
                <p className="text-teal-500 text-xs font-medium">דף יומי</p>
                <p className="font-bold text-teal-800 text-base">{day.dafYomi}</p>
              </div>
            </div>
          )}

          {/* Close button */}
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 transition-colors text-gray-600 font-medium text-sm"
          >
            סגור
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function MonthlyCalendar({ location = DEFAULT_LOCATION }: { location?: KehilaLocation }) {
  const today = useMemo(() => new Date(), []);
  const todayHeb = useMemo(() => new HDate(today), [today]);
  const todayStr = today.toDateString();

  const [hMonth, setHMonth] = useState(todayHeb.getMonth());
  const [hYear, setHYear] = useState(todayHeb.getFullYear());
  const [selected, setSelected] = useState<CalendarDay | null>(null);
  const [cityKey, setCityKey] = useState("bnei-brak");

  const activeLocation = CITIES[cityKey] ?? location;

  const days = useMemo<CalendarDay[]>(() => {
    const count = HDate.daysInMonth(hMonth, hYear);
    const result: CalendarDay[] = [];
    for (let d = 1; d <= count; d++) {
      result.push(buildDay(new HDate(d, hMonth, hYear).greg(), activeLocation, todayStr));
    }
    return result;
  }, [hMonth, hYear, activeLocation, todayStr]);

  const firstDayOfWeek = days[0]?.dayOfWeek ?? 0;
  const monthName = getHebrewMonthName(hMonth, hYear);
  const yearLabel = hebrewYearLabel(hYear);

  const goToPrev = () => { const p = prevHebrewMonth(hMonth, hYear); setHMonth(p.month); setHYear(p.year); };
  const goToNext = () => { const n = nextHebrewMonth(hMonth, hYear); setHMonth(n.month); setHYear(n.year); };
  const goToday  = () => { setHMonth(todayHeb.getMonth()); setHYear(todayHeb.getFullYear()); };

  const isCurrentMonth = hMonth === todayHeb.getMonth() && hYear === todayHeb.getFullYear();

  // Summary stats
  const earliestSunrise = days.reduce((m, d) => d.sunrise < m ? d.sunrise : m, "99:99");
  const latestSunset    = days.reduce((m, d) => d.sunset > m ? d.sunset : m, "00:00");
  const holidayCount    = days.filter((d) => d.isYomTov).length;
  const shabbatCount    = days.filter((d) => d.isShabbat).length;

  return (
    <div className="bg-slate-50 min-h-screen" dir="rtl">

      {/* ── Top header ────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100 shadow-sm px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center gap-3">

          {/* Month navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={goToPrev}
              className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95"
              aria-label="חודש קודם"
            >
              <ChevronRight />
            </button>

            <div className="text-center min-w-[140px] px-2">
              <h2 className="font-bold text-2xl text-gray-900 leading-tight">{monthName}</h2>
              <p className="text-gray-400 text-sm">{yearLabel}</p>
            </div>

            <button
              onClick={goToNext}
              className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95"
              aria-label="חודש הבא"
            >
              <ChevronLeft />
            </button>

            {!isCurrentMonth && (
              <button
                onClick={goToday}
                className="text-xs px-3 py-1.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium shadow-sm shadow-blue-200"
              >
                היום
              </button>
            )}
          </div>

          {/* City selector */}
          <div className="flex items-center gap-2 sm:mr-auto">
            <span className="text-xs text-gray-400 font-medium">📍</span>
            <select
              value={cityKey}
              onChange={(e) => setCityKey(e.target.value)}
              className="text-sm border border-gray-200 rounded-xl px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent cursor-pointer"
            >
              {Object.entries(CITIES).map(([key, c]) => (
                <option key={key} value={key}>{c.cityName}</option>
              ))}
            </select>
          </div>

          {/* Legend */}
          <div className="hidden xl:flex items-center gap-3">
            {[
              { color: "bg-blue-600",   label: "היום" },
              { color: "bg-indigo-100 border border-indigo-200", label: "שבת" },
              { color: "bg-amber-50 border border-amber-300",    label: "חג" },
              { color: "bg-violet-50 border border-violet-200",  label: "ערב שבת" },
            ].map(({ color, label }) => (
              <span key={label} className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className={`w-3 h-3 rounded-md ${color}`} />
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Calendar grid ────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-2 sm:px-4 lg:px-8 py-4">

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAY_HEADERS.map((h, i) => (
            <div
              key={h}
              className={`text-center text-xs font-bold py-1.5 rounded-lg
                ${i === 6 ? "text-indigo-600 bg-indigo-50" : "text-gray-400"}`}
            >
              {h}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div key={`pad-${i}`} className="rounded-2xl" />
          ))}
          {days.map((day) => (
            <DayCell key={day.gregDate.toISOString()} day={day} onClick={setSelected} />
          ))}
        </div>
      </div>

      {/* ── Stats bar ────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-2 sm:px-4 lg:px-8 pb-8">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-4 sm:px-5 py-3 border-b border-gray-50">
            <p className="font-bold text-gray-600 text-sm">
              {monthName} {yearLabel} — סיכום
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-x-reverse divide-gray-100">
            {[
              {
                icon: "🗓️",
                label: "ימים בחודש",
                value: days.length,
                color: "text-gray-700",
                bg: "",
              },
              {
                icon: "🌅",
                label: "זריחה מוקדמת",
                value: earliestSunrise,
                color: "text-orange-600",
                bg: "bg-orange-50/50",
              },
              {
                icon: "🌇",
                label: "שקיעה מאוחרת",
                value: latestSunset,
                color: "text-purple-600",
                bg: "bg-purple-50/50",
              },
              {
                icon: "✡️",
                label: `${shabbatCount} שבתות · ${holidayCount} חגים`,
                value: shabbatCount + holidayCount,
                color: "text-indigo-600",
                bg: "bg-indigo-50/50",
              },
            ].map(({ icon, label, value, color, bg }) => (
              <div key={label} className={`px-4 sm:px-5 py-4 text-center ${bg}`}>
                <p className="text-lg">{icon}</p>
                <p className={`font-bold text-xl sm:text-2xl tabular-nums mt-1 ${color}`}>{value}</p>
                <p className="text-gray-400 text-xs mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Day detail ───────────────────────────────────────────── */}
      {selected && <DayDetail day={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
