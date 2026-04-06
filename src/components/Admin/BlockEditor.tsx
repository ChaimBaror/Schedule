"use client";
import React, { useState } from "react";
import type {
  Block,
  BlockType,
  ColumnPosition,
  VisibilityRule,
  TimesContent,
  LessonContent,
  AnnouncementContent,
  ClockContent,
  BannerContent,
} from "@/types/block";
import type { Time } from "@/types/items";

// ─── Constants ───────────────────────────────────────────────────────────────

const BLOCK_TYPE_META: { value: BlockType; label: string; icon: string }[] = [
  { value: "times", label: "לוח זמנים", icon: "📋" },
  { value: "lesson", label: "שיעור", icon: "📖" },
  { value: "announcement", label: "הודעה / דרשה", icon: "🎤" },
  { value: "clock-analog", label: "שעון אנלוגי", icon: "🕐" },
  { value: "clock-digital", label: "שעון דיגיטלי", icon: "🔢" },
  { value: "banner", label: "באנר", icon: "📢" },
];

const COL_META: { value: ColumnPosition; label: string }[] = [
  { value: "right", label: "ימין" },
  { value: "middle", label: "אמצע" },
  { value: "left", label: "שמאל" },
];

const DAY_NAMES = ["א", "ב", "ג", "ד", "ה", "ו", "ש"];

function newId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function defaultContent(type: BlockType): Block["content"] {
  switch (type) {
    case "times":
      return { title: "חדש", times: [], description: "" } satisfies TimesContent;
    case "lesson":
      return { title: "שיעור חדש", teacher: "", time: "20:00", location: "", description: "" } satisfies LessonContent;
    case "announcement":
      return { title: "הודעה", text: "" } satisfies AnnouncementContent;
    case "clock-analog":
    case "clock-digital":
      return { label: "", showSeconds: false } satisfies ClockContent;
    case "banner":
      return { text: "" } satisfies BannerContent;
  }
}

// ─── Time editor row ─────────────────────────────────────────────────────────

function TimeRow({
  time,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: {
  time: Time;
  onChange: (t: Time) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}) {
  return (
    <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
      <div className="flex flex-col gap-0.5">
        <button onClick={onMoveUp} disabled={isFirst} className="text-gray-400 hover:text-gray-600 disabled:opacity-30 text-xs">▲</button>
        <button onClick={onMoveDown} disabled={isLast} className="text-gray-400 hover:text-gray-600 disabled:opacity-30 text-xs">▼</button>
      </div>
      <input
        value={time.name ?? ""}
        onChange={(e) => onChange({ ...time, name: e.target.value })}
        placeholder="שם (אופציונלי)"
        className="border border-gray-200 rounded-lg px-2 py-1 text-sm w-24 focus:outline-none focus:border-gray-400"
      />
      {time.dynamic ? (
        <div className="flex items-center gap-1 flex-1">
          <select
            value={time.zman ?? "shkiah"}
            onChange={(e) => onChange({ ...time, zman: e.target.value as Time["zman"] })}
            className="border border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:border-gray-400"
          >
            <option value="shkiah">שקיעה</option>
            <option value="CandleLightingTime">הדלקת נרות</option>
            <option value="getDailyLearningDafYomi">דף יומי</option>
          </select>
          <input
            value={time.nimus ?? "0"}
            onChange={(e) => onChange({ ...time, nimus: e.target.value })}
            placeholder="± דקות"
            className="border border-gray-200 rounded-lg px-2 py-1 text-sm w-16 focus:outline-none focus:border-gray-400"
            dir="ltr"
          />
          <label className="flex items-center gap-1 text-xs text-gray-500">
            <input
              type="checkbox"
              checked={time.roundToFiveMinutes ?? false}
              onChange={(e) => onChange({ ...time, roundToFiveMinutes: e.target.checked })}
            />
            עיגול ל-5
          </label>
        </div>
      ) : (
        <input
          value={time.val}
          onChange={(e) => onChange({ ...time, val: e.target.value })}
          placeholder="שעה / טקסט"
          className="border border-gray-200 rounded-lg px-2 py-1 text-sm flex-1 focus:outline-none focus:border-gray-400"
        />
      )}
      <label className="flex items-center gap-1 text-xs text-gray-500 shrink-0">
        <input
          type="checkbox"
          checked={time.dynamic ?? false}
          onChange={(e) => onChange({ ...time, dynamic: e.target.checked, zman: e.target.checked ? "shkiah" : undefined })}
        />
        דינמי
      </label>
      <button onClick={onDelete} className="text-red-400 hover:text-red-600 shrink-0 text-lg leading-none">&times;</button>
    </div>
  );
}

// ─── Visibility editor ───────────────────────────────────────────────────────

function VisibilityEditor({ value, onChange }: { value: VisibilityRule; onChange: (v: VisibilityRule) => void }) {
  return (
    <div className="space-y-2 border border-gray-200 rounded-xl p-3 bg-gray-50">
      <h4 className="font-medium text-sm text-gray-600">תנאי הצגה</h4>

      <div className="flex gap-2 flex-wrap">
        {(["always", "days", "date-range", "before-shabbat"] as const).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => onChange({ ...value, rule: r })}
            className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
              value.rule === r ? "bg-gray-800 text-white border-gray-800" : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
            }`}
          >
            {r === "always" ? "תמיד" : r === "days" ? "ימים מסוימים" : r === "date-range" ? "טווח תאריכים" : "לפני שבת"}
          </button>
        ))}
      </div>

      {value.rule === "days" && (
        <div className="flex gap-1">
          {DAY_NAMES.map((name, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                const days = value.days ?? [];
                onChange({ ...value, days: days.includes(i) ? days.filter((d) => d !== i) : [...days, i] });
              }}
              className={`w-8 h-8 rounded-lg text-sm font-medium border transition-colors ${
                value.days?.includes(i) ? "bg-gray-800 text-white border-gray-800" : "bg-white text-gray-600 border-gray-200"
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      )}

      {value.rule === "date-range" && (
        <div className="flex gap-2 items-center text-sm">
          <label className="text-gray-500">מ:</label>
          <input
            type="date"
            value={value.fromDate ?? ""}
            onChange={(e) => onChange({ ...value, fromDate: e.target.value })}
            className="border border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:border-gray-400"
          />
          <label className="text-gray-500">עד:</label>
          <input
            type="date"
            value={value.toDate ?? ""}
            onChange={(e) => onChange({ ...value, toDate: e.target.value })}
            className="border border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:border-gray-400"
          />
        </div>
      )}

      {value.rule === "before-shabbat" && (
        <div className="flex gap-2 items-center text-sm">
          <label className="text-gray-500">הצג</label>
          <input
            type="number"
            min={1}
            max={48}
            value={value.hoursBeforeShabbat ?? 6}
            onChange={(e) => onChange({ ...value, hoursBeforeShabbat: Number(e.target.value) })}
            className="border border-gray-200 rounded-lg px-2 py-1 text-sm w-16 focus:outline-none focus:border-gray-400"
          />
          <span className="text-gray-500">שעות לפני כניסת שבת</span>
        </div>
      )}
    </div>
  );
}

// ─── Block edit modal ────────────────────────────────────────────────────────

function BlockEditModal({
  block,
  onSave,
  onCancel,
}: {
  block: Block;
  onSave: (b: Block) => void;
  onCancel: () => void;
}) {
  const [edited, setEdited] = useState<Block>({ ...block, content: { ...block.content } });
  const typeMeta = BLOCK_TYPE_META.find((t) => t.value === edited.type)!;

  const updateContent = (patch: Partial<Block["content"]>) =>
    setEdited((prev) => ({ ...prev, content: { ...prev.content, ...patch } }));

  // Times-specific helpers
  const timesContent = edited.type === "times" ? (edited.content as TimesContent) : null;

  const updateTime = (idx: number, t: Time) => {
    if (!timesContent) return;
    const times = [...timesContent.times];
    times[idx] = t;
    updateContent({ times });
  };

  const addTime = () => {
    if (!timesContent) return;
    updateContent({ times: [...timesContent.times, { val: "", name: "" }] });
  };

  const deleteTime = (idx: number) => {
    if (!timesContent) return;
    updateContent({ times: timesContent.times.filter((_, i) => i !== idx) });
  };

  const moveTime = (idx: number, dir: -1 | 1) => {
    if (!timesContent) return;
    const times = [...timesContent.times];
    const target = idx + dir;
    if (target < 0 || target >= times.length) return;
    [times[idx], times[target]] = [times[target], times[idx]];
    updateContent({ times });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onCancel}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-5 space-y-4"
        dir="rtl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-lg text-gray-800">
            {typeMeta.icon} עריכת {typeMeta.label}
          </h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
        </div>

        {/* Column & index */}
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="text-xs text-gray-500 mb-1 block">עמודה</label>
            <select
              value={edited.col}
              onChange={(e) => setEdited({ ...edited, col: e.target.value as ColumnPosition })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
            >
              {COL_META.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <div className="w-20">
            <label className="text-xs text-gray-500 mb-1 block">סדר</label>
            <input
              type="number"
              value={edited.index}
              onChange={(e) => setEdited({ ...edited, index: Number(e.target.value) })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
            />
          </div>
        </div>

        {/* ── Times content ── */}
        {edited.type === "times" && timesContent && (
          <>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">כותרת</label>
              <input
                value={timesContent.title}
                onChange={(e) => updateContent({ title: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-gray-500 block">זמנים</label>
              {timesContent.times.map((t, i) => (
                <TimeRow
                  key={i}
                  time={t}
                  onChange={(updated) => updateTime(i, updated)}
                  onDelete={() => deleteTime(i)}
                  onMoveUp={() => moveTime(i, -1)}
                  onMoveDown={() => moveTime(i, 1)}
                  isFirst={i === 0}
                  isLast={i === timesContent.times.length - 1}
                />
              ))}
              <button
                type="button"
                onClick={addTime}
                className="w-full border-2 border-dashed border-gray-200 rounded-lg py-2 text-sm text-gray-400 hover:border-gray-400 hover:text-gray-600 transition-colors"
              >
                + הוסף זמן
              </button>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">תיאור (אופציונלי)</label>
              <textarea
                value={timesContent.description ?? ""}
                onChange={(e) => updateContent({ description: e.target.value })}
                rows={2}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:border-gray-400"
              />
            </div>
          </>
        )}

        {/* ── Lesson content ── */}
        {edited.type === "lesson" && (() => {
          const c = edited.content as LessonContent;
          return (
            <>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">שם השיעור</label>
                <input value={c.title} onChange={(e) => updateContent({ title: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-gray-400" />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-xs text-gray-500 mb-1 block">מרצה / רב</label>
                  <input value={c.teacher ?? ""} onChange={(e) => updateContent({ teacher: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-gray-400" />
                </div>
                <div className="w-24">
                  <label className="text-xs text-gray-500 mb-1 block">שעה</label>
                  <input value={c.time} onChange={(e) => updateContent({ time: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-gray-400" />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">מיקום</label>
                <input value={c.location ?? ""} onChange={(e) => updateContent({ location: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-gray-400" />
              </div>
            </>
          );
        })()}

        {/* ── Announcement content ── */}
        {edited.type === "announcement" && (() => {
          const c = edited.content as AnnouncementContent;
          return (
            <>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">כותרת</label>
                <input value={c.title} onChange={(e) => updateContent({ title: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-gray-400" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">טקסט</label>
                <textarea value={c.text} onChange={(e) => updateContent({ text: e.target.value })} rows={3} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:border-gray-400" />
              </div>
            </>
          );
        })()}

        {/* ── Clock content ── */}
        {(edited.type === "clock-analog" || edited.type === "clock-digital") && (() => {
          const c = edited.content as ClockContent;
          return (
            <>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">כיתוב (אופציונלי)</label>
                <input value={c.label ?? ""} onChange={(e) => updateContent({ label: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-gray-400" />
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" checked={c.showSeconds ?? false} onChange={(e) => updateContent({ showSeconds: e.target.checked })} />
                הצג שניות
              </label>
            </>
          );
        })()}

        {/* ── Banner content ── */}
        {edited.type === "banner" && (() => {
          const c = edited.content as BannerContent;
          return (
            <div>
              <label className="text-xs text-gray-500 mb-1 block">טקסט הבאנר</label>
              <input value={c.text} onChange={(e) => updateContent({ text: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-gray-400" />
            </div>
          );
        })()}

        {/* Visibility */}
        <VisibilityEditor
          value={edited.visibility}
          onChange={(visibility) => setEdited({ ...edited, visibility })}
        />

        {/* Actions */}
        <div className="flex gap-2 justify-end pt-2">
          <button onClick={onCancel} className="px-4 py-2 rounded-xl text-sm text-gray-600 border border-gray-200 hover:bg-gray-50">ביטול</button>
          <button onClick={() => onSave(edited)} className="px-4 py-2 rounded-xl text-sm font-medium bg-gray-800 text-white hover:bg-gray-700">שמור</button>
        </div>
      </div>
    </div>
  );
}

// ─── Block card preview (mini) ───────────────────────────────────────────────

function BlockCard({
  block,
  onEdit,
  onDelete,
}: {
  block: Block;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const typeMeta = BLOCK_TYPE_META.find((t) => t.value === block.type)!;
  const title =
    block.type === "times" ? (block.content as TimesContent).title :
    block.type === "lesson" ? (block.content as LessonContent).title :
    block.type === "announcement" ? (block.content as AnnouncementContent).title :
    block.type === "banner" ? (block.content as BannerContent).text :
    (block.content as ClockContent).label || typeMeta.label;

  const visLabel =
    block.visibility.rule === "always" ? "" :
    block.visibility.rule === "days" ? `ימים: ${block.visibility.days?.map((d) => DAY_NAMES[d]).join(", ")}` :
    block.visibility.rule === "date-range" ? "טווח תאריכים" :
    "לפני שבת";

  return (
    <div
      onClick={onEdit}
      className="bg-white border border-gray-200 rounded-xl p-3 cursor-pointer hover:shadow-md hover:border-gray-300 transition-all group"
    >
      <div className="flex items-start gap-2">
        <span className="text-lg">{typeMeta.icon}</span>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm text-gray-800 truncate">{title}</p>
          <p className="text-xs text-gray-400">{typeMeta.label}</p>
          {visLabel && (
            <p className="text-xs text-blue-500 mt-0.5">📅 {visLabel}</p>
          )}
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="text-red-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ─── Add block menu ──────────────────────────────────────────────────────────

function AddBlockMenu({ col, onAdd }: { col: ColumnPosition; onAdd: (block: Block) => void }) {
  const [open, setOpen] = useState(false);

  const handleAdd = (type: BlockType) => {
    onAdd({
      id: newId(),
      type,
      col,
      index: 999,
      visibility: { rule: "always" },
      content: defaultContent(type),
    });
    setOpen(false);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full border-2 border-dashed border-gray-200 rounded-xl py-3 text-sm text-gray-400 hover:border-gray-400 hover:text-gray-600 transition-colors"
      >
        + הוסף בלוק
      </button>
    );
  }

  return (
    <div className="border border-gray-200 rounded-xl p-3 bg-white shadow-sm space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-600">בחר סוג בלוק</span>
        <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 text-sm">&times;</button>
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        {BLOCK_TYPE_META.map((t) => (
          <button
            key={t.value}
            onClick={() => handleAdd(t.value)}
            className="flex items-center gap-2 p-2 rounded-lg border border-gray-100 hover:bg-gray-50 hover:border-gray-300 text-right transition-colors"
          >
            <span className="text-lg">{t.icon}</span>
            <span className="text-xs font-medium text-gray-700">{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Main ScheduleTab component ──────────────────────────────────────────────

export function ScheduleTab({
  blocks,
  onBlocksChange,
}: {
  blocks: Block[];
  onBlocksChange: (blocks: Block[]) => void;
}) {
  const [editingBlock, setEditingBlock] = useState<Block | null>(null);

  const colBlocks = (col: ColumnPosition) =>
    blocks.filter((b) => b.col === col).sort((a, b) => a.index - b.index);

  const handleSaveBlock = (updated: Block) => {
    const exists = blocks.find((b) => b.id === updated.id);
    if (exists) {
      onBlocksChange(blocks.map((b) => (b.id === updated.id ? updated : b)));
    } else {
      // Assign proper index
      const colItems = colBlocks(updated.col);
      updated.index = colItems.length;
      onBlocksChange([...blocks, updated]);
    }
    setEditingBlock(null);
  };

  const handleDeleteBlock = (id: string) => {
    onBlocksChange(blocks.filter((b) => b.id !== id));
  };

  const handleAddBlock = (block: Block) => {
    const colItems = colBlocks(block.col);
    block.index = colItems.length;
    onBlocksChange([...blocks, block]);
    setEditingBlock(block);
  };

  return (
    <div dir="rtl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {COL_META.map((col) => (
          <div key={col.value} className="space-y-2">
            <h3 className="font-bold text-gray-700 text-center py-2 bg-white rounded-xl shadow-sm">
              {col.label}
            </h3>
            <div className="space-y-2">
              {colBlocks(col.value).map((block) => (
                <BlockCard
                  key={block.id}
                  block={block}
                  onEdit={() => setEditingBlock(block)}
                  onDelete={() => handleDeleteBlock(block.id)}
                />
              ))}
            </div>
            <AddBlockMenu col={col.value} onAdd={handleAddBlock} />
          </div>
        ))}
      </div>

      {editingBlock && (
        <BlockEditModal
          block={editingBlock}
          onSave={handleSaveBlock}
          onCancel={() => setEditingBlock(null)}
        />
      )}
    </div>
  );
}
