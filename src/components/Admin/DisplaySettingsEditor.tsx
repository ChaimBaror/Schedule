"use client";
import React from "react";
import type { DisplaySettings, TickerSpeed, ScrollMode, DesktopLayout, ColumnCount } from "@/types/kehila";

const TICKER_SPEEDS: { value: TickerSpeed; label: string }[] = [
  { value: "slow", label: "איטי" },
  { value: "normal", label: "רגיל" },
  { value: "fast", label: "מהיר" },
];

const SCROLL_MODES: { value: ScrollMode; label: string; desc: string }[] = [
  { value: "bounce", label: "הלוך-חזור", desc: "גולל למטה ואז חזרה למעלה" },
  { value: "down", label: "מעגלי", desc: "גולל למטה וקופץ להתחלה" },
  { value: "none", label: "ללא גלילה", desc: "תוכן שגולש נחתך" },
];

const MOBILE_INTERVALS: { value: number; label: string }[] = [
  { value: 0, label: "ידני בלבד" },
  { value: 5000, label: "5 שניות" },
  { value: 8000, label: "8 שניות" },
  { value: 12000, label: "12 שניות" },
  { value: 15000, label: "15 שניות" },
  { value: 20000, label: "20 שניות" },
];

export function DisplaySettingsEditor({
  value,
  onChange,
}: {
  value: DisplaySettings;
  onChange: (s: DisplaySettings) => void;
}) {
  const update = (patch: Partial<DisplaySettings>) => onChange({ ...value, ...patch });

  return (
    <div className="space-y-5" dir="rtl">

      {/* ── Ticker ── */}
      <div className="bg-white rounded-2xl shadow p-4 space-y-3">
        <h3 className="font-bold text-lg text-gray-700">שורת גלילה (טיקר)</h3>

        <div>
          <label className="text-sm text-gray-500 block mb-1.5">מהירות גלילה</label>
          <div className="flex gap-2">
            {TICKER_SPEEDS.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => update({ tickerSpeed: s.value })}
                className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-colors ${
                  value.tickerSpeed === s.value
                    ? "bg-gray-800 text-white border-gray-800"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
          <input
            type="checkbox"
            checked={value.tickerPauseOnHover}
            onChange={(e) => update({ tickerPauseOnHover: e.target.checked })}
            className="rounded"
          />
          עצור גלילה בהעברת עכבר
        </label>
      </div>

      {/* ── Column overflow ── */}
      <div className="bg-white rounded-2xl shadow p-4 space-y-3">
        <h3 className="font-bold text-lg text-gray-700">גלילת עמודות (כשתוכן גולש)</h3>

        <div>
          <label className="text-sm text-gray-500 block mb-1.5">מצב גלילה</label>
          <div className="space-y-1.5">
            {SCROLL_MODES.map((m) => (
              <button
                key={m.value}
                type="button"
                onClick={() => update({ columnScrollMode: m.value })}
                className={`w-full text-right flex items-start gap-3 px-3 py-2.5 rounded-xl border transition-colors ${
                  value.columnScrollMode === m.value
                    ? "bg-gray-50 border-gray-800 shadow-sm"
                    : "border-gray-200 hover:border-gray-400"
                }`}
              >
                <span className={`mt-0.5 w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${
                  value.columnScrollMode === m.value ? "border-gray-800" : "border-gray-300"
                }`}>
                  {value.columnScrollMode === m.value && <span className="w-2 h-2 rounded-full bg-gray-800" />}
                </span>
                <div>
                  <p className="text-sm font-medium text-gray-800">{m.label}</p>
                  <p className="text-xs text-gray-400">{m.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {value.columnScrollMode !== "none" && (
          <>
            <div>
              <label className="text-sm text-gray-500 block mb-1">מהירות גלילה ({value.columnScrollSpeed} px/שנ)</label>
              <input
                type="range"
                min={10}
                max={80}
                step={5}
                value={value.columnScrollSpeed}
                onChange={(e) => update({ columnScrollSpeed: Number(e.target.value) })}
                className="w-full accent-gray-800"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>איטי</span>
                <span>מהיר</span>
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-500 block mb-1">השהיה בקצוות ({(value.columnPauseAtEdge / 1000).toFixed(1)} שנ)</label>
              <input
                type="range"
                min={1000}
                max={10000}
                step={500}
                value={value.columnPauseAtEdge}
                onChange={(e) => update({ columnPauseAtEdge: Number(e.target.value) })}
                className="w-full accent-gray-800"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>1 שנ</span>
                <span>10 שנ</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Column count ── */}
      <div className="bg-white rounded-2xl shadow p-4 space-y-3">
        <h3 className="font-bold text-lg text-gray-700">מספר עמודות</h3>
        <div className="flex gap-2">
          {([2, 3] as ColumnCount[]).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => update({ columnCount: n })}
              className={`flex-1 py-3 rounded-xl text-sm font-medium border transition-colors flex flex-col items-center gap-1 ${
                value.columnCount === n
                  ? "bg-gray-800 text-white border-gray-800"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
              }`}
            >
              <div className="flex gap-1">
                {Array.from({ length: n }).map((_, i) => (
                  <div key={i} className={`w-4 h-6 rounded-sm ${value.columnCount === n ? "bg-white/30" : "bg-gray-200"}`} />
                ))}
              </div>
              <span>{n} עמודות</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Desktop layout ── */}
      <div className="bg-white rounded-2xl shadow p-4 space-y-3">
        <h3 className="font-bold text-lg text-gray-700">תצוגת מסך מלא (דסקטופ)</h3>

        <div className="space-y-1.5">
          {([
            { value: "columns" as DesktopLayout, label: "3 עמודות זו לצד זו", desc: "כל העמודות מוצגות במקביל" },
            { value: "auto-page" as DesktopLayout, label: "דפדוף אוטומטי", desc: "עמודה אחת בכל פעם, מעבר אוטומטי" },
          ]).map((m) => (
            <button
              key={m.value}
              type="button"
              onClick={() => update({ desktopLayout: m.value })}
              className={`w-full text-right flex items-start gap-3 px-3 py-2.5 rounded-xl border transition-colors ${
                value.desktopLayout === m.value
                  ? "bg-gray-50 border-gray-800 shadow-sm"
                  : "border-gray-200 hover:border-gray-400"
              }`}
            >
              <span className={`mt-0.5 w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${
                value.desktopLayout === m.value ? "border-gray-800" : "border-gray-300"
              }`}>
                {value.desktopLayout === m.value && <span className="w-2 h-2 rounded-full bg-gray-800" />}
              </span>
              <div>
                <p className="text-sm font-medium text-gray-800">{m.label}</p>
                <p className="text-xs text-gray-400">{m.desc}</p>
              </div>
            </button>
          ))}
        </div>

        {value.desktopLayout === "auto-page" && (
          <div>
            <label className="text-sm text-gray-500 block mb-1.5">זמן בין דפדופים (דסקטופ)</label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { value: 5000, label: "5 שניות" },
                { value: 8000, label: "8 שניות" },
                { value: 10000, label: "10 שניות" },
                { value: 15000, label: "15 שניות" },
                { value: 20000, label: "20 שניות" },
                { value: 30000, label: "30 שניות" },
              ].map((iv) => (
                <button
                  key={iv.value}
                  type="button"
                  onClick={() => update({ desktopPageInterval: iv.value })}
                  className={`py-2 rounded-xl text-xs font-medium border transition-colors ${
                    value.desktopPageInterval === iv.value
                      ? "bg-gray-800 text-white border-gray-800"
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                  }`}
                >
                  {iv.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Mobile paging ── */}
      <div className="bg-white rounded-2xl shadow p-4 space-y-3">
        <h3 className="font-bold text-lg text-gray-700">דפדוף אוטומטי (מובייל)</h3>
        <p className="text-xs text-gray-400">במסך קטן - מעבר אוטומטי בין עמודות</p>

        <div>
          <label className="text-sm text-gray-500 block mb-1.5">זמן בין דפדופים</label>
          <div className="grid grid-cols-3 gap-1.5">
            {MOBILE_INTERVALS.map((iv) => (
              <button
                key={iv.value}
                type="button"
                onClick={() => update({ mobilePageInterval: iv.value })}
                className={`py-2 rounded-xl text-xs font-medium border transition-colors ${
                  value.mobilePageInterval === iv.value
                    ? "bg-gray-800 text-white border-gray-800"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                }`}
              >
                {iv.label}
              </button>
            ))}
          </div>
        </div>

        {value.mobilePageInterval > 0 && (
          <div>
            <label className="text-sm text-gray-500 block mb-1">מהירות מעבר ({(value.mobileTransitionDuration / 1000).toFixed(1)} שנ)</label>
            <input
              type="range"
              min={200}
              max={1500}
              step={100}
              value={value.mobileTransitionDuration}
              onChange={(e) => update({ mobileTransitionDuration: Number(e.target.value) })}
              className="w-full accent-gray-800"
            />
          </div>
        )}
      </div>
    </div>
  );
}
