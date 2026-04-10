"use client";
import React, { useState } from "react";
import type {
  Block,
  BlockType,
  BlockSpan,
  ColumnPosition,
  VisibilityRule,
  TimesContent,
  LessonContent,
  AnnouncementContent,
  ClockContent,
  BannerContent,
  ZmanimSummaryContent,
  ParashaContent,
  ImageContent,
  CountdownContent,
  DividerContent,
  SpacerContent,
} from "@/types/block";
import type { Time } from "@/types/items";

// ─── Constants ───────────────────────────────────────────────────────────────

const BLOCK_TYPE_META: { value: BlockType; label: string; icon: string; category: string }[] = [
  { value: "times", label: "לוח זמנים", icon: "📋", category: "תוכן" },
  { value: "lesson", label: "שיעור", icon: "📖", category: "תוכן" },
  { value: "announcement", label: "הודעה / דרשה", icon: "🎤", category: "תוכן" },
  { value: "banner", label: "באנר", icon: "📢", category: "תוכן" },
  { value: "clock-analog", label: "שעון אנלוגי", icon: "🕐", category: "ווידג׳ט" },
  { value: "clock-digital", label: "שעון דיגיטלי", icon: "🔢", category: "ווידג׳ט" },
  { value: "zmanim-summary", label: "סיכום זמנים", icon: "🌅", category: "ווידג׳ט" },
  { value: "parasha", label: "פרשה / תאריך", icon: "📜", category: "ווידג׳ט" },
  { value: "countdown", label: "ספירה לאחור", icon: "⏳", category: "ווידג׳ט" },
  { value: "image", label: "תמונה", icon: "🖼️", category: "ווידג׳ט" },
  { value: "divider", label: "קו הפרדה", icon: "➖", category: "עיצוב" },
  { value: "spacer", label: "רווח", icon: "↕️", category: "עיצוב" },
];

const EDIT_COLS: { value: ColumnPosition; label: string; icon: string }[] = [
  { value: "right", label: "ימין", icon: "◀" },
  { value: "middle", label: "אמצע", icon: "⬛" },
  { value: "left", label: "שמאל", icon: "▶" },
];

const ALL_COLS: { value: ColumnPosition; label: string }[] = [
  ...EDIT_COLS,
  { value: "full", label: "רוחב מלא" },
];

const SPAN_META: { value: BlockSpan; label: string }[] = [
  { value: 1, label: "1" },
  { value: 2, label: "2" },
  { value: 3, label: "3" },
];

const DAY_NAMES = ["א", "ב", "ג", "ד", "ה", "ו", "ש"];

function newId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function defaultContent(type: BlockType): Block["content"] {
  switch (type) {
    case "times": return { title: "חדש", times: [], description: "" } satisfies TimesContent;
    case "lesson": return { title: "שיעור חדש", teacher: "", time: "20:00", location: "", description: "" } satisfies LessonContent;
    case "announcement": return { title: "הודעה", text: "" } satisfies AnnouncementContent;
    case "clock-analog": case "clock-digital": return { label: "", showSeconds: false } satisfies ClockContent;
    case "banner": return { text: "" } satisfies BannerContent;
    case "zmanim-summary": return { fields: ["sunrise", "sofZmanShma", "chatzot", "shkiah", "candleLighting", "shabbatEnd"], title: "זמני היום" } satisfies ZmanimSummaryContent;
    case "parasha": return { show: "both" } satisfies ParashaContent;
    case "image": return { url: "", alt: "", maxHeight: 200 } satisfies ImageContent;
    case "countdown": return { label: "ספירה", targetDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10), showDays: true, showHours: true, showMinutes: true } satisfies CountdownContent;
    case "divider": return { style: "ornament" } satisfies DividerContent;
    case "spacer": return { height: 24 } satisfies SpacerContent;
  }
}

function getBlockTitle(block: Block): string {
  switch (block.type) {
    case "times": return (block.content as TimesContent).title;
    case "lesson": return (block.content as LessonContent).title;
    case "announcement": return (block.content as AnnouncementContent).title;
    case "banner": return (block.content as BannerContent).text || "באנר";
    case "zmanim-summary": return (block.content as ZmanimSummaryContent).title || "סיכום זמנים";
    case "countdown": return (block.content as CountdownContent).label;
    default: return BLOCK_TYPE_META.find((t) => t.value === block.type)?.label ?? block.type;
  }
}

// ─── Shared input styles ─────────────────────────────────────────────────────

const inputCls = "w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all";
const labelCls = "text-xs font-medium text-gray-500 mb-1 block";

// ─── Time editor row ─────────────────────────────────────────────────────────

function TimeRow({ time, onChange, onDelete, onMoveUp, onMoveDown, isFirst, isLast }: {
  time: Time; onChange: (t: Time) => void; onDelete: () => void;
  onMoveUp: () => void; onMoveDown: () => void; isFirst: boolean; isLast: boolean;
}) {
  return (
    <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-2.5 border border-gray-100">
      <div className="flex flex-col gap-0.5">
        <button onClick={onMoveUp} disabled={isFirst} className="text-gray-400 hover:text-gray-700 disabled:opacity-20 text-xs leading-none p-0.5">▲</button>
        <button onClick={onMoveDown} disabled={isLast} className="text-gray-400 hover:text-gray-700 disabled:opacity-20 text-xs leading-none p-0.5">▼</button>
      </div>
      <input value={time.name ?? ""} onChange={(e) => onChange({ ...time, name: e.target.value })} placeholder="שם"
        className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm w-24 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
      {time.dynamic ? (
        <div className="flex items-center gap-1.5 flex-1">
          <select value={time.zman ?? "shkiah"} onChange={(e) => onChange({ ...time, zman: e.target.value as Time["zman"] })}
            className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400">
            <option value="shkiah">שקיעה</option>
            <option value="CandleLightingTime">הדלקת נרות</option>
            <option value="getDailyLearningDafYomi">דף יומי</option>
          </select>
          <input value={time.nimus ?? "0"} onChange={(e) => onChange({ ...time, nimus: e.target.value })} placeholder="±"
            className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm w-14 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" dir="ltr" />
          <label className="flex items-center gap-1 text-xs text-gray-500 shrink-0">
            <input type="checkbox" checked={time.roundToFiveMinutes ?? false} onChange={(e) => onChange({ ...time, roundToFiveMinutes: e.target.checked })} className="rounded" />
            ×5
          </label>
        </div>
      ) : (
        <input value={time.val} onChange={(e) => onChange({ ...time, val: e.target.value })} placeholder="שעה / טקסט"
          className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
      )}
      <label className="flex items-center gap-1 text-xs text-gray-500 shrink-0 cursor-pointer">
        <input type="checkbox" checked={time.dynamic ?? false} className="rounded"
          onChange={(e) => onChange({ ...time, dynamic: e.target.checked, zman: e.target.checked ? "shkiah" : undefined })} />
        דינמי
      </label>
      <button onClick={onDelete} className="text-red-300 hover:text-red-500 shrink-0 p-1 rounded-lg hover:bg-red-50 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
        </svg>
      </button>
    </div>
  );
}

// ─── Visibility editor ───────────────────────────────────────────────────────

function VisibilityEditor({ value, onChange }: { value: VisibilityRule; onChange: (v: VisibilityRule) => void }) {
  const [expanded, setExpanded] = useState(value.rule !== "always");

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button type="button" onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-3 py-2.5 bg-gray-50 hover:bg-gray-100 transition-colors text-right">
        <div className="flex items-center gap-2">
          <span className="text-sm">📅</span>
          <span className="text-sm font-medium text-gray-600">תנאי הצגה</span>
          {value.rule !== "always" && (
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
              {value.rule === "days" ? "ימים" : value.rule === "date-range" ? "תאריכים" : "לפני שבת"}
            </span>
          )}
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
          className={`size-4 text-gray-400 transition-transform ${expanded ? "rotate-180" : ""}`}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {expanded && (
        <div className="p-3 space-y-3 bg-white">
          <div className="flex gap-1.5 flex-wrap">
            {(["always", "days", "date-range", "before-shabbat"] as const).map((r) => (
              <button key={r} type="button" onClick={() => onChange({ ...value, rule: r })}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  value.rule === r ? "bg-gray-800 text-white border-gray-800 shadow-sm" : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
                }`}>
                {r === "always" ? "תמיד" : r === "days" ? "ימים מסוימים" : r === "date-range" ? "טווח תאריכים" : "לפני שבת"}
              </button>
            ))}
          </div>
          {value.rule === "days" && (
            <div className="flex gap-1.5">
              {DAY_NAMES.map((name, i) => (
                <button key={i} type="button" onClick={() => {
                  const days = value.days ?? [];
                  onChange({ ...value, days: days.includes(i) ? days.filter((d) => d !== i) : [...days, i] });
                }} className={`w-9 h-9 rounded-lg text-sm font-medium border transition-all ${
                  value.days?.includes(i) ? "bg-blue-600 text-white border-blue-600 shadow-sm" : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
                }`}>{name}</button>
              ))}
            </div>
          )}
          {value.rule === "date-range" && (
            <div className="flex gap-2 items-center text-sm">
              <label className="text-gray-500 shrink-0">מ:</label>
              <input type="date" value={value.fromDate ?? ""} onChange={(e) => onChange({ ...value, fromDate: e.target.value })} className={inputCls} />
              <label className="text-gray-500 shrink-0">עד:</label>
              <input type="date" value={value.toDate ?? ""} onChange={(e) => onChange({ ...value, toDate: e.target.value })} className={inputCls} />
            </div>
          )}
          {value.rule === "before-shabbat" && (
            <div className="flex gap-2 items-center text-sm">
              <label className="text-gray-500">הצג</label>
              <input type="number" min={1} max={48} value={value.hoursBeforeShabbat ?? 6}
                onChange={(e) => onChange({ ...value, hoursBeforeShabbat: Number(e.target.value) })}
                className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm w-16 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
              <span className="text-gray-500">שעות לפני כניסת שבת</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Block edit modal ────────────────────────────────────────────────────────

function BlockEditModal({ block, onSave, onCancel, onDuplicate, onDelete }: {
  block: Block; onSave: (b: Block) => void; onCancel: () => void;
  onDuplicate: (b: Block) => void; onDelete: (id: string) => void;
}) {
  const [edited, setEdited] = useState<Block>({ ...block, content: { ...block.content } });
  const typeMeta = BLOCK_TYPE_META.find((t) => t.value === edited.type)!;

  const updateContent = (patch: Partial<Block["content"]>) =>
    setEdited((prev) => ({ ...prev, content: { ...prev.content, ...patch } }));

  const timesContent = edited.type === "times" ? (edited.content as TimesContent) : null;
  const updateTime = (idx: number, t: Time) => { if (!timesContent) return; const times = [...timesContent.times]; times[idx] = t; updateContent({ times }); };
  const addTime = () => { if (!timesContent) return; updateContent({ times: [...timesContent.times, { val: "", name: "" }] }); };
  const deleteTime = (idx: number) => { if (!timesContent) return; updateContent({ times: timesContent.times.filter((_, i) => i !== idx) }); };
  const moveTime = (idx: number, dir: -1 | 1) => { if (!timesContent) return; const times = [...timesContent.times]; const t = idx + dir; if (t < 0 || t >= times.length) return; [times[idx], times[t]] = [times[t], times[idx]]; updateContent({ times }); };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={onCancel}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" dir="rtl" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="sticky top-0 bg-white z-10 px-5 pt-5 pb-3 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">{typeMeta.icon}</span>
              <h2 className="font-bold text-lg text-gray-800">{typeMeta.label}</h2>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => onDuplicate(edited)} title="שכפל"
                className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                </svg>
              </button>
              <button onClick={() => { if (confirm("למחוק בלוק זה?")) { onDelete(edited.id); onCancel(); } }} title="מחק"
                className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
              </button>
              <button onClick={onCancel} className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="p-5 space-y-4">
          {/* Position: column + span + index */}
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <label className={labelCls}>עמודה</label>
              <div className="flex gap-1">
                {ALL_COLS.map((c) => (
                  <button key={c.value} type="button" onClick={() => setEdited({ ...edited, col: c.value })}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-all ${
                      edited.col === c.value ? "bg-gray-800 text-white border-gray-800" : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
                    }`}>{c.label}</button>
                ))}
              </div>
            </div>
          </div>

          {edited.col !== "full" && (
            <div>
              <label className={labelCls}>רוחב</label>
              <div className="flex gap-1">
                {SPAN_META.map((s) => (
                  <button key={s.value} type="button" onClick={() => setEdited({ ...edited, span: s.value })}
                    className={`px-4 py-2 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 ${
                      (edited.span ?? 1) === s.value ? "bg-gray-800 text-white border-gray-800" : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
                    }`}>
                    <span className="flex gap-0.5">{Array.from({ length: s.value }).map((_, i) => <span key={i} className={`w-3 h-4 rounded-sm ${(edited.span ?? 1) === s.value ? "bg-white/30" : "bg-gray-200"}`} />)}</span>
                    {s.value === 1 ? "רגיל" : s.value === 2 ? "כפול" : "מלא"}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Content editors per type ── */}

          {edited.type === "times" && timesContent && (
            <div className="space-y-3">
              <div><label className={labelCls}>כותרת</label><input value={timesContent.title} onChange={(e) => updateContent({ title: e.target.value })} className={inputCls} /></div>
              <div className="space-y-2">
                <label className={labelCls}>זמנים ({timesContent.times.length})</label>
                {timesContent.times.map((t, i) => (
                  <TimeRow key={i} time={t} onChange={(u) => updateTime(i, u)} onDelete={() => deleteTime(i)}
                    onMoveUp={() => moveTime(i, -1)} onMoveDown={() => moveTime(i, 1)}
                    isFirst={i === 0} isLast={i === timesContent.times.length - 1} />
                ))}
                <button type="button" onClick={addTime}
                  className="w-full border-2 border-dashed border-gray-200 rounded-xl py-2.5 text-sm text-gray-400 hover:border-blue-300 hover:text-blue-500 transition-colors">
                  + הוסף זמן
                </button>
              </div>
              <div><label className={labelCls}>תיאור</label><textarea value={timesContent.description ?? ""} onChange={(e) => updateContent({ description: e.target.value })} rows={2} className={`${inputCls} resize-none`} /></div>
            </div>
          )}

          {edited.type === "lesson" && (() => { const c = edited.content as LessonContent; return (
            <div className="space-y-3">
              <div><label className={labelCls}>שם השיעור</label><input value={c.title} onChange={(e) => updateContent({ title: e.target.value })} className={inputCls} /></div>
              <div className="flex gap-3">
                <div className="flex-1"><label className={labelCls}>מרצה / רב</label><input value={c.teacher ?? ""} onChange={(e) => updateContent({ teacher: e.target.value })} className={inputCls} /></div>
                <div className="w-24"><label className={labelCls}>שעה</label><input value={c.time} onChange={(e) => updateContent({ time: e.target.value })} className={inputCls} /></div>
              </div>
              <div><label className={labelCls}>מיקום</label><input value={c.location ?? ""} onChange={(e) => updateContent({ location: e.target.value })} className={inputCls} /></div>
            </div>
          ); })()}

          {edited.type === "announcement" && (() => { const c = edited.content as AnnouncementContent; return (
            <div className="space-y-3">
              <div><label className={labelCls}>כותרת</label><input value={c.title} onChange={(e) => updateContent({ title: e.target.value })} className={inputCls} /></div>
              <div><label className={labelCls}>טקסט</label><textarea value={c.text} onChange={(e) => updateContent({ text: e.target.value })} rows={3} className={`${inputCls} resize-none`} /></div>
            </div>
          ); })()}

          {(edited.type === "clock-analog" || edited.type === "clock-digital") && (() => { const c = edited.content as ClockContent; return (
            <div className="space-y-3">
              <div><label className={labelCls}>כיתוב</label><input value={c.label ?? ""} onChange={(e) => updateContent({ label: e.target.value })} className={inputCls} placeholder="אופציונלי" /></div>
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer"><input type="checkbox" checked={c.showSeconds ?? false} onChange={(e) => updateContent({ showSeconds: e.target.checked })} className="rounded" /> הצג שניות</label>
            </div>
          ); })()}

          {edited.type === "banner" && (() => { const c = edited.content as BannerContent; return (
            <div><label className={labelCls}>טקסט</label><input value={c.text} onChange={(e) => updateContent({ text: e.target.value })} className={inputCls} /></div>
          ); })()}

          {edited.type === "zmanim-summary" && (() => { const c = edited.content as ZmanimSummaryContent;
            const ALL = ["sunrise","sofZmanShma","chatzot","minchaGedola","shkiah","candleLighting","shabbatEnd"] as const;
            const L: Record<string,string> = { sunrise:"זריחה", sofZmanShma:'סוף ק"ש', chatzot:"חצות", minchaGedola:"מנחה גדולה", shkiah:"שקיעה", candleLighting:"הדלקת נרות", shabbatEnd:"צאת שבת" };
            return (<div className="space-y-3">
              <div><label className={labelCls}>כותרת</label><input value={c.title ?? ""} onChange={(e) => updateContent({ title: e.target.value })} className={inputCls} /></div>
              <div><label className={labelCls}>שדות</label>
                <div className="flex flex-wrap gap-1.5">{ALL.map((f) => (
                  <button key={f} type="button" onClick={() => updateContent({ fields: c.fields.includes(f) ? c.fields.filter((x) => x !== f) : [...c.fields, f] })}
                    className={`px-2.5 py-1.5 rounded-lg text-xs border transition-all ${c.fields.includes(f) ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-500 border-gray-200"}`}>{L[f]}</button>
                ))}</div></div>
            </div>); })()}

          {edited.type === "parasha" && (() => { const c = edited.content as ParashaContent; return (
            <div><label className={labelCls}>הצג</label><div className="flex gap-2">
              {([["parasha","פרשה"],["date","תאריך"],["both","שניהם"]] as const).map(([v,l]) => (
                <button key={v} type="button" onClick={() => updateContent({ show: v })}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all ${c.show === v ? "bg-gray-800 text-white border-gray-800" : "bg-white text-gray-500 border-gray-200"}`}>{l}</button>
              ))}</div></div>
          ); })()}

          {edited.type === "image" && (() => { const c = edited.content as ImageContent; return (
            <div className="space-y-3">
              <div><label className={labelCls}>URL תמונה</label><input value={c.url} onChange={(e) => updateContent({ url: e.target.value })} placeholder="https://..." dir="ltr" className={inputCls} /></div>
              {c.url && <img src={c.url} alt="" className="h-24 mx-auto object-contain rounded-xl border border-gray-100 bg-gray-50 p-2" />}
              <div><label className={labelCls}>גובה מקסימלי ({c.maxHeight ?? 200}px)</label><input type="range" min={50} max={500} step={10} value={c.maxHeight ?? 200} onChange={(e) => updateContent({ maxHeight: Number(e.target.value) })} className="w-full accent-blue-600" /></div>
            </div>
          ); })()}

          {edited.type === "countdown" && (() => { const c = edited.content as CountdownContent; return (
            <div className="space-y-3">
              <div><label className={labelCls}>שם האירוע</label><input value={c.label} onChange={(e) => updateContent({ label: e.target.value })} className={inputCls} /></div>
              <div><label className={labelCls}>תאריך יעד</label><input type="date" value={c.targetDate.slice(0, 10)} onChange={(e) => updateContent({ targetDate: e.target.value })} className={inputCls} /></div>
            </div>
          ); })()}

          {edited.type === "divider" && (() => { const c = edited.content as DividerContent; return (
            <div><label className={labelCls}>סגנון</label><div className="flex gap-2">
              {([["line","── קו ──"],["dots","• • • • •"],["ornament","─ ✦ ─"]] as const).map(([v,l]) => (
                <button key={v} type="button" onClick={() => updateContent({ style: v })}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all ${c.style === v ? "bg-gray-800 text-white border-gray-800" : "bg-white text-gray-500 border-gray-200"}`}>{l}</button>
              ))}</div></div>
          ); })()}

          {edited.type === "spacer" && (() => { const c = edited.content as SpacerContent; return (
            <div><label className={labelCls}>גובה ({c.height}px)</label><input type="range" min={8} max={100} step={4} value={c.height} onChange={(e) => updateContent({ height: Number(e.target.value) })} className="w-full accent-blue-600" /></div>
          ); })()}

          <VisibilityEditor value={edited.visibility} onChange={(visibility) => setEdited({ ...edited, visibility })} />
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-5 py-3 flex gap-2 justify-end">
          <button onClick={onCancel} className="px-5 py-2.5 rounded-xl text-sm text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors">ביטול</button>
          <button onClick={() => onSave(edited)} className="px-5 py-2.5 rounded-xl text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-colors">שמור שינויים</button>
        </div>
      </div>
    </div>
  );
}

// ─── Block card ──────────────────────────────────────────────────────────────

function BlockCard({ block, onEdit, onDelete, onMoveUp, onMoveDown, onDuplicate, isFirst, isLast }: {
  block: Block; onEdit: () => void; onDelete: () => void; onDuplicate: () => void;
  onMoveUp: () => void; onMoveDown: () => void; isFirst: boolean; isLast: boolean;
}) {
  const typeMeta = BLOCK_TYPE_META.find((t) => t.value === block.type)!;
  const title = getBlockTitle(block);
  const visLabel = block.visibility.rule === "always" ? null :
    block.visibility.rule === "days" ? `${block.visibility.days?.map((d) => DAY_NAMES[d]).join("")}` :
    block.visibility.rule === "date-range" ? "תאריכים" : "ע״ש";

  return (
    <div onClick={onEdit}
      className="bg-white border border-gray-200 rounded-xl p-2.5 cursor-pointer hover:shadow-lg hover:border-blue-200 hover:-translate-y-0.5 transition-all group">
      <div className="flex items-center gap-2.5">
        {/* Reorder */}
        <div className="flex flex-col gap-0 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
          <button onClick={onMoveUp} disabled={isFirst} className="text-gray-400 hover:text-gray-700 disabled:opacity-20 text-[10px] leading-none p-0.5">▲</button>
          <button onClick={onMoveDown} disabled={isLast} className="text-gray-400 hover:text-gray-700 disabled:opacity-20 text-[10px] leading-none p-0.5">▼</button>
        </div>

        {/* Icon */}
        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-base shrink-0 group-hover:bg-blue-50 transition-colors">
          {typeMeta.icon}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm text-gray-800 truncate leading-tight">{title}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[10px] text-gray-400">{typeMeta.label}</span>
            {block.span && block.span > 1 && <span className="text-[10px] bg-purple-100 text-purple-600 px-1.5 py-0 rounded-full">×{block.span}</span>}
            {visLabel && <span className="text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0 rounded-full">{visLabel}</span>}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
          <button onClick={onDuplicate} title="שכפל"
            className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
            </svg>
          </button>
          <button onClick={onDelete} title="מחק"
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Add block menu ──────────────────────────────────────────────────────────

function AddBlockMenu({ col, onAdd }: { col: ColumnPosition; onAdd: (block: Block) => void }) {
  const [open, setOpen] = useState(false);

  const handleAdd = (type: BlockType) => {
    onAdd({ id: newId(), type, col, index: 999, visibility: { rule: "always" }, content: defaultContent(type) });
    setOpen(false);
  };

  if (!open) {
    return (
      <button onClick={() => setOpen(true)}
        className="w-full border-2 border-dashed border-gray-200 rounded-xl py-3 text-sm text-gray-400 hover:border-blue-300 hover:text-blue-500 hover:bg-blue-50/50 transition-all">
        + הוסף ווידג׳ט
      </button>
    );
  }

  const categories = [...new Set(BLOCK_TYPE_META.map((t) => t.category))];

  return (
    <div className="border border-gray-200 rounded-xl bg-white shadow-lg overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2.5 bg-gray-50 border-b border-gray-100">
        <span className="text-sm font-medium text-gray-600">הוסף ווידג׳ט</span>
        <button onClick={() => setOpen(false)} className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="p-2 space-y-2">
        {categories.map((cat) => (
          <div key={cat}>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-1 mb-1">{cat}</p>
            <div className="grid grid-cols-2 gap-1">
              {BLOCK_TYPE_META.filter((t) => t.category === cat).map((t) => (
                <button key={t.value} onClick={() => handleAdd(t.value)}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-blue-50 hover:text-blue-700 text-right transition-colors text-gray-600">
                  <span className="text-base w-6 text-center">{t.icon}</span>
                  <span className="text-xs font-medium">{t.label}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main ScheduleTab ────────────────────────────────────────────────────────

export function ScheduleTab({ blocks, onBlocksChange }: { blocks: Block[]; onBlocksChange: (blocks: Block[]) => void }) {
  const [editingBlock, setEditingBlock] = useState<Block | null>(null);

  const colBlocks = (col: ColumnPosition) => blocks.filter((b) => b.col === col).sort((a, b) => a.index - b.index);

  const handleSave = (updated: Block) => {
    const exists = blocks.find((b) => b.id === updated.id);
    if (exists) onBlocksChange(blocks.map((b) => (b.id === updated.id ? updated : b)));
    else { updated.index = colBlocks(updated.col).length; onBlocksChange([...blocks, updated]); }
    setEditingBlock(null);
  };

  const handleDelete = (id: string) => onBlocksChange(blocks.filter((b) => b.id !== id));

  const handleDuplicate = (block: Block) => {
    const dup = { ...block, id: newId(), content: { ...block.content }, index: block.index + 1 };
    onBlocksChange([...blocks, dup]);
    setEditingBlock(dup);
  };

  const handleAdd = (block: Block) => {
    block.index = colBlocks(block.col).length;
    onBlocksChange([...blocks, block]);
    setEditingBlock(block);
  };

  const handleMove = (col: ColumnPosition, idx: number, dir: -1 | 1) => {
    const items = colBlocks(col);
    const target = idx + dir;
    if (target < 0 || target >= items.length) return;
    const updated = blocks.map((b) => {
      if (b.id === items[idx].id) return { ...b, index: target };
      if (b.id === items[target].id) return { ...b, index: idx };
      return b;
    });
    onBlocksChange(updated);
  };

  return (
    <div dir="rtl">
      {/* Column headers + count */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {EDIT_COLS.map((col) => {
          const items = colBlocks(col.value);
          return (
            <div key={col.value}>
              <div className="flex items-center justify-between mb-2 px-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-gray-700">{col.label}</h3>
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">{items.length}</span>
                </div>
              </div>

              <div className="space-y-1.5 min-h-[60px]">
                {items.map((block, idx) => (
                  <BlockCard
                    key={block.id}
                    block={block}
                    onEdit={() => setEditingBlock(block)}
                    onDelete={() => { if (confirm("למחוק?")) handleDelete(block.id); }}
                    onDuplicate={() => handleDuplicate(block)}
                    onMoveUp={() => handleMove(col.value, idx, -1)}
                    onMoveDown={() => handleMove(col.value, idx, 1)}
                    isFirst={idx === 0}
                    isLast={idx === items.length - 1}
                  />
                ))}
              </div>

              <div className="mt-2">
                <AddBlockMenu col={col.value} onAdd={handleAdd} />
              </div>
            </div>
          );
        })}
      </div>

      {editingBlock && (
        <BlockEditModal
          block={editingBlock}
          onSave={handleSave}
          onCancel={() => setEditingBlock(null)}
          onDuplicate={handleDuplicate}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
