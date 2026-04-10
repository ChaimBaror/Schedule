"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  getKehilaState,
  getKehilaItems,
  getKehilaBlocks,
  saveKehilaBlocks,
  saveAnnouncement,
  deleteAnnouncement,
  updateKehilaTemplate,
  updateKehilaLogo,
  saveKehilaDisplaySettings,
  getDayOverrides,
  saveDayOverride,
  deleteDayOverride,
  getImageAnnouncements,
  saveImageAnnouncement,
  deleteImageAnnouncement,
} from "@/services/kehila.service";
import { buildZmanimDisplay } from "@/utils/zmanim-display";
import { TEMPLATE_META } from "@/templates/index";
import type { KehilaState, Announcement, AnnouncementType, ImageAnnouncement, TemplateId, DisplaySettings } from "@/types/kehila";
import { DEFAULT_DISPLAY_SETTINGS } from "@/types/kehila";
import type { Item } from "@/types/items";
import type { Block } from "@/types/block";
import type { DayOverride } from "@/types/dayOverride";
import type { ZmanimDisplay } from "@/templates/types";
import { ScheduleTab } from "@/components/Admin/BlockEditor";
import { DisplaySettingsEditor } from "@/components/Admin/DisplaySettingsEditor";
import { MonthlyCalendarEditor } from "@/components/Admin/MonthlyCalendarEditor";
import { ImageAnnouncementUploader } from "@/components/Admin/ImageAnnouncementUploader";
import { ClassicTemplate }     from "@/templates/ClassicTemplate";
import { ModernTemplate }      from "@/templates/ModernTemplate";
import { LedTemplate }         from "@/templates/LedTemplate";
import { SephardicTemplate }   from "@/templates/SephardicTemplate";
import { ParchmentTemplate }   from "@/templates/ParchmentTemplate";
import { NightTemplate }       from "@/templates/NightTemplate";
import { GoldenTemplate }      from "@/templates/GoldenTemplate";
import { RoyalBlueTemplate }   from "@/templates/RoyalBlueTemplate";
import { MarbleTemplate }      from "@/templates/MarbleTemplate";
import { WoodTemplate }        from "@/templates/WoodTemplate";

// ─── Announcement form ────────────────────────────────────────────────────────
const ANN_TYPES: { value: AnnouncementType; label: string; icon: string }[] = [
  { value: "simcha", label: "שמחה", icon: "🎊" },
  { value: "avel",   label: "אבל", icon: "🕯️" },
  { value: "notice", label: "הודעה", icon: "📢" },
];

function AnnouncementForm({ onSave }: { onSave: (a: Announcement) => void }) {
  const [text, setText] = useState("");
  const [type, setType] = useState<AnnouncementType>("notice");
  const [expires, setExpires] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSave({
      id: Date.now().toString(),
      type,
      text: text.trim(),
      priority: type === "avel" ? 0 : type === "simcha" ? 1 : 2,
      expiresAt: expires || undefined,
    });
    setText("");
    setExpires("");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow p-4 space-y-3" dir="rtl">
      <h3 className="font-bold text-lg text-gray-700">הוסף מודעה</h3>
      <div className="flex gap-2">
        {ANN_TYPES.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setType(t.value)}
            className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-colors ${
              type === t.value ? "bg-gray-800 text-white border-gray-800" : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="טקסט המודעה..."
        rows={2}
        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:border-gray-400"
      />
      <div className="flex gap-2 items-center">
        <label className="text-sm text-gray-500 shrink-0">תפוגה:</label>
        <input
          type="date"
          value={expires}
          onChange={(e) => setExpires(e.target.value)}
          className="border border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:border-gray-400"
        />
        <button
          type="submit"
          className="mr-auto bg-gray-800 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors"
        >
          הוסף
        </button>
      </div>
    </form>
  );
}

// ─── Template selector ────────────────────────────────────────────────────────
function TemplateSelector({ current, onChange }: { current: TemplateId; onChange: (id: TemplateId) => void }) {
  const ids = Object.keys(TEMPLATE_META) as TemplateId[];
  return (
    <div className="bg-white rounded-2xl shadow p-4" dir="rtl">
      <h3 className="font-bold text-lg text-gray-700 mb-3">בחר עיצוב</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {ids.map((id) => (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`p-3 rounded-xl border text-right transition-all ${
              current === id
                ? "border-gray-800 bg-gray-50 shadow-sm"
                : "border-gray-200 hover:border-gray-400"
            }`}
          >
            <div className="font-bold text-sm text-gray-800">{TEMPLATE_META[id].label}</div>
            <div className="text-xs text-gray-400 mt-0.5">{TEMPLATE_META[id].description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Main admin page ──────────────────────────────────────────────────────────
export default function AdminPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: session, status } = useSession();
  const router = useRouter();

  // Auth guard: only admin or gabay assigned to this kehila
  const userRole = session?.user?.role;
  const userKehilot = session?.user?.kehilaSlugs || [];
  const isAuthorized = userRole === "admin" || (userRole === "gabay" && userKehilot.includes(slug));

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  const [state, setState] = useState<KehilaState | null>(null);
  const [items, setItems] = useState<{ right: Item[]; medium: Item[]; left: Item[] } | null>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [dayOverrides, setDayOverrides] = useState<DayOverride[]>([]);
  const [imageAnns, setImageAnns] = useState<ImageAnnouncement[]>([]);
  const [displaySettings, setDisplaySettings] = useState<DisplaySettings>(DEFAULT_DISPLAY_SETTINGS);
  const [zmanim, setZmanim] = useState<ZmanimDisplay | null>(null);
  const [tab, setTab] = useState<"schedule" | "calendar" | "preview" | "announcements" | "settings">("schedule");
  const [error, setError] = useState(false);

  useEffect(() => {
    const s = getKehilaState(slug);
    if (!s) { setError(true); return; }
    setState(s);
    setItems(getKehilaItems(slug));
    setBlocks(getKehilaBlocks(slug));
    setDayOverrides(getDayOverrides(slug));
    setImageAnns(getImageAnnouncements(slug));
    setDisplaySettings(s.displaySettings);
    setZmanim(buildZmanimDisplay(s.kehila.location));
  }, [slug]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-800" />
      </div>
    );
  }

  if (status === "authenticated" && !isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100" dir="rtl">
        <p className="text-xl text-gray-600">אין לך הרשאה לנהל את הקהילה: <strong>{slug}</strong></p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100" dir="rtl">
        <p className="text-xl text-gray-600">קהילה לא נמצאה: <strong>{slug}</strong></p>
      </div>
    );
  }

  if (!state || !items || !zmanim) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-800" />
      </div>
    );
  }

  const handleAddAnn = (ann: Announcement) => {
    saveAnnouncement(slug, ann);
    setState((prev) => prev ? { ...prev, announcements: [...prev.announcements, ann] } : prev);
  };

  const handleDeleteAnn = (id: string) => {
    deleteAnnouncement(slug, id);
    setState((prev) => prev ? { ...prev, announcements: prev.announcements.filter((a) => a.id !== id) } : prev);
  };

  const handleTemplateChange = (tid: TemplateId) => {
    updateKehilaTemplate(slug, tid);
    setState((prev) => prev ? { ...prev, kehila: { ...prev.kehila, templateId: tid } } : prev);
  };

  const handleLogoChange = (url: string) => {
    updateKehilaLogo(slug, url);
    setState((prev) => prev ? { ...prev, kehila: { ...prev.kehila, logoUrl: url || undefined } } : prev);
  };

  const handleBlocksChange = (updated: Block[]) => {
    setBlocks(updated);
    saveKehilaBlocks(slug, updated);
  };

  const handleDayOverrideSave = (override: DayOverride) => {
    saveDayOverride(slug, override);
    setDayOverrides((prev) => {
      const idx = prev.findIndex((o) => o.date === override.date);
      if (idx >= 0) return prev.map((o, i) => (i === idx ? override : o));
      return [...prev, override];
    });
  };

  const handleDayOverrideDelete = (date: string) => {
    deleteDayOverride(slug, date);
    setDayOverrides((prev) => prev.filter((o) => o.date !== date));
  };

  const handleImageAnnSave = (img: ImageAnnouncement) => {
    saveImageAnnouncement(slug, img);
    setImageAnns((prev) => {
      const idx = prev.findIndex((a) => a.id === img.id);
      if (idx >= 0) return prev.map((a, i) => (i === idx ? img : a));
      return [...prev, img];
    });
  };

  const handleImageAnnDelete = (id: string) => {
    deleteImageAnnouncement(slug, id);
    setImageAnns((prev) => prev.filter((a) => a.id !== id));
  };

  const handleImageAnnResize = (id: string, width: number) => {
    setImageAnns((prev) => {
      const updated = prev.map((a) => (a.id === id ? { ...a, displayWidth: width } : a));
      const img = updated.find((a) => a.id === id);
      if (img) saveImageAnnouncement(slug, img);
      return updated;
    });
  };

  const handleDisplaySettingsChange = (updated: DisplaySettings) => {
    setDisplaySettings(updated);
    saveKehilaDisplaySettings(slug, updated);
  };

  const templateProps = {
    kehila: state.kehila,
    itemsRight: items.right,
    itemsMiddle: items.medium,
    itemsLeft: items.left,
    announcements: state.announcements,
    zmanim,
    isKiosk: true,
    blocks,
    displaySettings,
  };

  const PreviewCmp =
    state.kehila.templateId === "modern"      ? ModernTemplate      :
    state.kehila.templateId === "led"         ? LedTemplate         :
    state.kehila.templateId === "sephardic"   ? SephardicTemplate   :
    state.kehila.templateId === "parchment"   ? ParchmentTemplate   :
    state.kehila.templateId === "night"       ? NightTemplate       :
    state.kehila.templateId === "golden"      ? GoldenTemplate      :
    state.kehila.templateId === "royal-blue"  ? RoyalBlueTemplate   :
    state.kehila.templateId === "marble"      ? MarbleTemplate      :
    state.kehila.templateId === "wood"        ? WoodTemplate        :
    ClassicTemplate;

  return (
    <div className="min-h-screen bg-gray-100" dir="rtl">
      {/* Top nav */}
      <header className="bg-white border-b border-gray-200 px-4 sm:px-8 py-3 flex items-center gap-4 flex-wrap">
        <div>
          <h1 className="font-bold text-xl text-gray-800">{state.kehila.name}</h1>
          <p className="text-sm text-gray-500">{state.kehila.city} · ניהול</p>
        </div>
        <a
          href={`/kehila/${slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mr-auto text-sm bg-gray-800 text-white px-3 py-1.5 rounded-lg hover:bg-gray-700 flex items-center gap-1"
        >
          <span>צפה במסך ציבורי</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
        </a>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-8 flex gap-1">
        {(["schedule", "calendar", "announcements", "settings", "preview"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === t ? "border-gray-800 text-gray-800" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {t === "schedule" ? "📋 לוח זמנים" : t === "calendar" ? "📅 לוח חודשי" : t === "announcements" ? "📢 מודעות" : t === "settings" ? "⚙️ הגדרות" : "👁️ תצוגה מקדימה"}
          </button>
        ))}
      </div>

      <main className={`${tab === "schedule" ? "max-w-[1600px]" : "max-w-5xl"} mx-auto px-4 sm:px-8 py-6 space-y-4`}>
        {/* Calendar tab – monthly calendar with day overrides */}
        {tab === "calendar" && (
          <>
            <div className="bg-white rounded-2xl shadow p-4" dir="rtl">
              <h3 className="font-bold text-lg text-gray-700 mb-1">עריכת זמנים לפי יום</h3>
              <p className="text-sm text-gray-500 mb-4">
                לחץ על יום בלוח כדי להגדיר זמני תפילה מותאמים. הזמנים יוצגו בלוח הציבורי ביום המתאים.
              </p>
            </div>
            <MonthlyCalendarEditor
              overrides={dayOverrides}
              onSave={handleDayOverrideSave}
              onDelete={handleDayOverrideDelete}
            />
          </>
        )}

        {/* Schedule tab – editor + live preview side by side */}
        {tab === "schedule" && (
          <div className="flex gap-6 items-start">
            <div className="flex-1 min-w-0">
              <ScheduleTab blocks={blocks} onBlocksChange={handleBlocksChange} />
            </div>
            <div className="hidden lg:block w-[480px] shrink-0 sticky top-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2 text-center">תצוגה מקדימה</h3>
              <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-200">
                <div className="bg-gray-200 text-gray-600 text-xs px-3 py-1 flex items-center gap-2">
                  <span className="flex gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                  </span>
                  <span className="font-mono text-[10px]">/kehila/{slug}</span>
                </div>
                <div className="max-h-[75vh] overflow-y-auto" style={{ transform: "scale(0.45)", transformOrigin: "top center", width: "222%", marginBottom: "-55%" }}>
                  <PreviewCmp {...templateProps} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Announcements tab */}
        {tab === "announcements" && (
          <>
            <AnnouncementForm onSave={handleAddAnn} />
            <ImageAnnouncementUploader
              images={imageAnns}
              onSave={handleImageAnnSave}
              onDelete={handleImageAnnDelete}
              onUpdateSize={handleImageAnnResize}
            />
            <div className="bg-white rounded-2xl shadow p-4" dir="rtl">
              <h3 className="font-bold text-lg text-gray-700 mb-3">מודעות פעילות</h3>
              {state.announcements.length === 0 ? (
                <p className="text-gray-400 text-sm">אין מודעות פעילות</p>
              ) : (
                <ul className="space-y-2">
                  {state.announcements.map((a) => (
                    <li key={a.id} className="flex items-start gap-3 border border-gray-100 rounded-xl p-3">
                      <span className="text-xl mt-0.5">
                        {a.type === "simcha" ? "🎊" : a.type === "avel" ? "🕯️" : "📢"}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-700">{a.text}</p>
                        {a.expiresAt && (
                          <p className="text-xs text-gray-400 mt-0.5">
                            תפוגה: {new Date(a.expiresAt).toLocaleDateString("he-IL")}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteAnn(a.id)}
                        className="text-red-400 hover:text-red-600 shrink-0"
                        aria-label="מחק"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}

        {/* Settings tab */}
        {tab === "settings" && (
          <>
            <TemplateSelector current={state.kehila.templateId} onChange={handleTemplateChange} />
            <DisplaySettingsEditor value={displaySettings} onChange={handleDisplaySettingsChange} />
            <div className="bg-white rounded-2xl shadow p-4" dir="rtl">
              <h3 className="font-bold text-lg text-gray-700 mb-3">לוגו הקהילה</h3>
              <div className="flex items-center gap-4 flex-wrap">
                {state.kehila.logoUrl ? (
                  <img src={state.kehila.logoUrl} alt="לוגו" className="h-16 w-16 rounded-xl object-contain border border-gray-200 bg-gray-50" />
                ) : (
                  <div className="h-16 w-16 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center text-2xl text-gray-300">🕍</div>
                )}
                <div className="flex-1 min-w-0 space-y-2">
                  <input
                    type="url"
                    defaultValue={state.kehila.logoUrl ?? ""}
                    placeholder="הדבק כאן URL של תמונת לוגו..."
                    onBlur={(e) => handleLogoChange(e.target.value.trim())}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
                    dir="ltr"
                  />
                  <p className="text-xs text-gray-400">הלוגו יוצג בכותרת כל התבניות. השאר ריק להסרה.</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow p-4" dir="rtl">
              <h3 className="font-bold text-lg text-gray-700 mb-3">פרטי הקהילה</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div><span className="text-gray-400">שם:</span> <span className="font-medium">{state.kehila.name}</span></div>
                <div><span className="text-gray-400">עיר:</span> <span className="font-medium">{state.kehila.city}</span></div>
                <div><span className="text-gray-400">עיצוב:</span> <span className="font-medium">{TEMPLATE_META[state.kehila.templateId].label}</span></div>
                <div><span className="text-gray-400">קואורדינטות:</span> <span className="font-mono text-xs">{state.kehila.location.lat}, {state.kehila.location.lng}</span></div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow p-4" dir="rtl">
              <h3 className="font-bold text-lg text-gray-700 mb-2">קוד הטמעה לאתר</h3>
              <p className="text-sm text-gray-500 mb-2">הטמע את לוח הזמנים באתר הקהילה:</p>
              <pre className="bg-gray-900 text-green-400 rounded-xl p-3 text-xs overflow-x-auto select-all">
{`<iframe
  src="${typeof window !== "undefined" ? window.location.origin : ""}/kehila/${slug}"
  width="100%"
  height="800"
  frameborder="0"
  title="${state.kehila.name}"
/>`}
              </pre>
            </div>
          </>
        )}

        {/* Preview tab */}
        {tab === "preview" && (
          <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-200">
            <div className="bg-gray-200 text-gray-600 text-xs px-4 py-1.5 flex items-center gap-2">
              <span className="flex gap-1">
                <span className="w-3 h-3 rounded-full bg-red-400" />
                <span className="w-3 h-3 rounded-full bg-yellow-400" />
                <span className="w-3 h-3 rounded-full bg-green-400" />
              </span>
              <span className="font-mono">/kehila/{slug}</span>
            </div>
            <div className="max-h-[600px] overflow-y-auto">
              <PreviewCmp {...templateProps} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
