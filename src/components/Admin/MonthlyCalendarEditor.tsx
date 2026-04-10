"use client";
import React, { useState, useMemo } from "react";
import type { DayOverride, DayTimeEntry, DayAnnouncement, DayAnnouncementType } from "@/types/dayOverride";

// ─── Helpers ────────────────────────────────────────────────────────────────

const HEB_DAYS = ["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ש׳"];
const HEB_MONTHS = [
  "ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני",
  "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר",
];

function toDateStr(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function newId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

const ANN_TYPES: { value: DayAnnouncementType; label: string; icon: string }[] = [
  { value: "simcha", label: "שמחה", icon: "🎊" },
  { value: "avel",   label: "אבל",  icon: "🕯️" },
  { value: "notice", label: "הודעה", icon: "📢" },
];

function getDaysInMonth(year: number, month: number): Date[] {
  const days: Date[] = [];
  const d = new Date(year, month, 1);
  while (d.getMonth() === month) {
    days.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return days;
}

// ─── Day editor modal ───────────────────────────────────────────────────────

function DayEditorModal({
  date,
  override,
  onSave,
  onDelete,
  onClose,
}: {
  date: Date;
  override: DayOverride | null;
  onSave: (o: DayOverride) => void;
  onDelete: () => void;
  onClose: () => void;
}) {
  const dateStr = toDateStr(date);
  const [items, setItems] = useState<DayTimeEntry[]>(override?.items ?? []);
  const [announcements, setAnnouncements] = useState<DayAnnouncement[]>(override?.announcements ?? []);
  const [note, setNote] = useState(override?.note ?? "");

  const addItem = () => {
    setItems((prev) => [...prev, { id: newId(), title: "", times: [""] }]);
  };

  const updateItem = (idx: number, updated: DayTimeEntry) => {
    setItems((prev) => prev.map((it, i) => (i === idx ? updated : it)));
  };

  const removeItem = (idx: number) => {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const addTime = (itemIdx: number) => {
    setItems((prev) =>
      prev.map((it, i) =>
        i === itemIdx ? { ...it, times: [...it.times, ""] } : it
      )
    );
  };

  const updateTime = (itemIdx: number, timeIdx: number, val: string) => {
    setItems((prev) =>
      prev.map((it, i) =>
        i === itemIdx
          ? { ...it, times: it.times.map((t, j) => (j === timeIdx ? val : t)) }
          : it
      )
    );
  };

  const removeTime = (itemIdx: number, timeIdx: number) => {
    setItems((prev) =>
      prev.map((it, i) =>
        i === itemIdx
          ? { ...it, times: it.times.filter((_, j) => j !== timeIdx) }
          : it
      )
    );
  };

  const addAnnouncement = () => {
    setAnnouncements((prev) => [...prev, { id: newId(), type: "notice", text: "" }]);
  };

  const updateAnnouncement = (idx: number, updated: DayAnnouncement) => {
    setAnnouncements((prev) => prev.map((a, i) => (i === idx ? updated : a)));
  };

  const removeAnnouncement = (idx: number) => {
    setAnnouncements((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSave = () => {
    const filteredItems = items.filter(
      (it) => it.title.trim() && it.times.some((t) => t.trim())
    );
    const filteredAnn = announcements.filter((a) => a.text.trim());
    if (filteredItems.length === 0 && filteredAnn.length === 0 && !note.trim()) {
      onDelete();
    } else {
      onSave({
        date: dateStr,
        items: filteredItems.map((it) => ({
          ...it,
          times: it.times.filter((t) => t.trim()),
        })),
        announcements: filteredAnn.length > 0 ? filteredAnn : undefined,
        note: note.trim() || undefined,
      });
    }
    onClose();
  };

  const dayLabel = date.toLocaleDateString("he-IL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        dir="rtl"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between rounded-t-2xl">
          <div>
            <h3 className="font-bold text-lg text-gray-800">עריכת זמנים ליום</h3>
            <p className="text-sm text-gray-500">{dayLabel}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-4">
          {/* Note */}
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">
              הערה ליום (אופציונלי)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder='לדוגמה: "ראש חודש", "יום זיכרון"...'
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
            />
          </div>

          {/* Items */}
          {items.map((item, itemIdx) => (
            <div
              key={item.id}
              className="border border-gray-200 rounded-xl p-3 space-y-2 bg-gray-50"
            >
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) =>
                    updateItem(itemIdx, { ...item, title: e.target.value })
                  }
                  placeholder="שם (לדוגמה: שחרית, מנחה...)"
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-400 bg-white"
                />
                <button
                  onClick={() => removeItem(itemIdx)}
                  className="text-red-400 hover:text-red-600 shrink-0 p-1"
                  title="מחק פריט"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                </button>
              </div>

              {/* Times */}
              <div className="space-y-1.5 mr-2">
                {item.times.map((time, timeIdx) => (
                  <div key={timeIdx} className="flex items-center gap-2">
                    <input
                      type="time"
                      value={time}
                      onChange={(e) =>
                        updateTime(itemIdx, timeIdx, e.target.value)
                      }
                      className="border border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:border-blue-400 bg-white"
                    />
                    {item.times.length > 1 && (
                      <button
                        onClick={() => removeTime(itemIdx, timeIdx)}
                        className="text-gray-400 hover:text-red-500 text-xs"
                        title="מחק זמן"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => addTime(itemIdx)}
                  className="text-xs text-blue-500 hover:text-blue-700 font-medium"
                >
                  + הוסף זמן
                </button>
              </div>
            </div>
          ))}

          <button
            onClick={addItem}
            className="w-full border-2 border-dashed border-gray-300 rounded-xl py-3 text-sm font-medium text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors"
          >
            + הוסף פריט זמנים
          </button>

          {/* Announcements section */}
          <div className="border-t border-gray-200 pt-4 mt-2">
            <h4 className="font-bold text-sm text-gray-700 mb-2">מודעות ליום</h4>

            {announcements.map((ann, annIdx) => (
              <div
                key={ann.id}
                className="border border-gray-200 rounded-xl p-3 space-y-2 bg-amber-50/50 mb-2"
              >
                {/* Type selector */}
                <div className="flex gap-1.5">
                  {ANN_TYPES.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => updateAnnouncement(annIdx, { ...ann, type: t.value })}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        ann.type === t.value
                          ? "bg-gray-800 text-white border-gray-800"
                          : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      {t.icon} {t.label}
                    </button>
                  ))}
                </div>

                {/* Text + delete */}
                <div className="flex items-start gap-2">
                  <textarea
                    value={ann.text}
                    onChange={(e) => updateAnnouncement(annIdx, { ...ann, text: e.target.value })}
                    placeholder="טקסט המודעה..."
                    rows={2}
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm resize-none focus:outline-none focus:border-blue-400 bg-white"
                  />
                  <button
                    onClick={() => removeAnnouncement(annIdx)}
                    className="text-red-400 hover:text-red-600 shrink-0 p-1 mt-1"
                    title="מחק מודעה"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={addAnnouncement}
              className="w-full border-2 border-dashed border-amber-300 rounded-xl py-3 text-sm font-medium text-amber-600 hover:border-amber-400 hover:text-amber-700 transition-colors"
            >
              + הוסף מודעה ליום
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-5 py-3 flex items-center gap-2 rounded-b-2xl">
          {override && (
            <button
              onClick={() => {
                onDelete();
                onClose();
              }}
              className="text-red-500 hover:text-red-700 text-sm font-medium px-3 py-2"
            >
              מחק הכל
            </button>
          )}
          <div className="flex-1" />
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
          >
            ביטול
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-gray-800 text-white text-sm font-medium rounded-xl hover:bg-gray-700 transition-colors"
          >
            שמור
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main calendar component ────────────────────────────────────────────────

export function MonthlyCalendarEditor({
  overrides,
  onSave,
  onDelete,
}: {
  overrides: DayOverride[];
  onSave: (o: DayOverride) => void;
  onDelete: (date: string) => void;
}) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const overrideMap = useMemo(() => {
    const map = new Map<string, DayOverride>();
    for (const o of overrides) map.set(o.date, o);
    return map;
  }, [overrides]);

  const days = useMemo(
    () => getDaysInMonth(viewYear, viewMonth),
    [viewYear, viewMonth]
  );

  // First day offset (Sunday=0 based, but we need to adjust for Hebrew week starting Sunday)
  const firstDayOfWeek = days[0].getDay();

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const goToToday = () => {
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
  };

  const todayStr = toDateStr(today);

  return (
    <div className="bg-white rounded-2xl shadow p-4" dir="rtl">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={nextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </button>
        <div className="text-center">
          <h3 className="font-bold text-lg text-gray-800">
            {HEB_MONTHS[viewMonth]} {viewYear}
          </h3>
          <button
            onClick={goToToday}
            className="text-xs text-blue-500 hover:text-blue-700 font-medium"
          >
            חזור להיום
          </button>
        </div>
        <button
          onClick={prevMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {HEB_DAYS.map((d) => (
          <div
            key={d}
            className="text-center text-xs font-medium text-gray-500 py-1"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for offset */}
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {days.map((day) => {
          const dateStr = toDateStr(day);
          const override = overrideMap.get(dateStr);
          const isToday = dateStr === todayStr;
          const itemCount = override?.items.length ?? 0;
          const annCount = override?.announcements?.length ?? 0;
          const hasContent = itemCount > 0 || annCount > 0 || !!override?.note;

          return (
            <button
              key={dateStr}
              onClick={() => setSelectedDate(day)}
              className={`
                relative p-1.5 rounded-xl text-sm transition-all min-h-[60px] flex flex-col items-center
                ${isToday ? "ring-2 ring-blue-500 bg-blue-50" : "hover:bg-gray-50"}
                ${hasContent ? "bg-green-50 border border-green-200" : "border border-transparent"}
              `}
            >
              <span
                className={`font-medium ${
                  isToday
                    ? "text-blue-600"
                    : day.getDay() === 6
                      ? "text-amber-600"
                      : "text-gray-700"
                }`}
              >
                {day.getDate()}
              </span>
              {hasContent && (
                <div className="mt-0.5 flex flex-col items-center gap-0.5">
                  <div className="flex gap-0.5">
                    {itemCount > 0 && <span className="w-1.5 h-1.5 rounded-full bg-green-500" />}
                    {annCount > 0 && <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
                  </div>
                  {itemCount > 0 && (
                    <span className="text-[10px] text-green-600 leading-none">
                      {itemCount} {itemCount === 1 ? "זמן" : "זמנים"}
                    </span>
                  )}
                  {annCount > 0 && (
                    <span className="text-[10px] text-amber-600 leading-none">
                      {annCount} {annCount === 1 ? "מודעה" : "מודעות"}
                    </span>
                  )}
                </div>
              )}
              {override?.note && (
                <span className="text-[9px] text-gray-400 leading-tight mt-0.5 truncate max-w-full px-0.5">
                  {override.note}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 text-xs text-gray-500 border-t border-gray-100 pt-3 flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
          <span>זמנים</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span>מודעות</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
          <span>היום</span>
        </div>
        <span className="text-gray-400 mr-auto">לחץ על יום לעריכה</span>
      </div>

      {/* Day editor modal */}
      {selectedDate && (
        <DayEditorModal
          date={selectedDate}
          override={overrideMap.get(toDateStr(selectedDate)) ?? null}
          onSave={onSave}
          onDelete={() => onDelete(toDateStr(selectedDate))}
          onClose={() => setSelectedDate(null)}
        />
      )}
    </div>
  );
}
