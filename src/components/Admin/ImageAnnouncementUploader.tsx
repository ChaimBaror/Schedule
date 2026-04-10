"use client";
import React, { useState, useRef } from "react";
import type { ImageAnnouncement } from "@/types/kehila";

const SIZE_PRESETS: { label: string; width: number }[] = [
  { label: "קטן", width: 300 },
  { label: "בינוני", width: 500 },
  { label: "גדול", width: 700 },
  { label: "מלא", width: 1000 },
];

function newId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

// ─── Upload form ────────────────────────────────────────────────────────────

function UploadForm({ onSave }: { onSave: (img: ImageAnnouncement) => void }) {
  const [preview, setPreview] = useState<string | null>(null);
  const [displayWidth, setDisplayWidth] = useState(500);
  const [label, setLabel] = useState("");
  const [expires, setExpires] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!preview) return;
    onSave({
      id: newId(),
      imageData: preview,
      displayWidth,
      label: label.trim() || undefined,
      expiresAt: expires || undefined,
    });
    setPreview(null);
    setLabel("");
    setExpires("");
    setDisplayWidth(500);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow p-4 space-y-4" dir="rtl">
      <h3 className="font-bold text-lg text-gray-700">העלאת מודעה / תמונה</h3>

      {/* File input */}
      <div>
        <label className="text-xs font-medium text-gray-500 mb-1 block">בחר קובץ מהמחשב</label>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:ml-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-gray-800 file:text-white hover:file:bg-gray-700 file:cursor-pointer"
        />
        <p className="text-xs text-gray-400 mt-1">תמונה בלבד (JPG, PNG, WebP). נשמר באופן מקומי בלבד.</p>
      </div>

      {/* Preview */}
      {preview && (
        <div className="border border-gray-200 rounded-xl p-3 bg-gray-50">
          <p className="text-xs font-medium text-gray-500 mb-2">תצוגה מקדימה:</p>
          <div className="flex justify-center">
            <img
              src={preview}
              alt="תצוגה מקדימה"
              className="object-contain rounded-lg border border-gray-200"
              style={{ maxWidth: `${displayWidth}px`, maxHeight: "300px" }}
            />
          </div>
        </div>
      )}

      {/* Size selector */}
      <div>
        <label className="text-xs font-medium text-gray-500 mb-1 block">גודל תצוגה</label>
        <div className="flex gap-2 mb-2">
          {SIZE_PRESETS.map((p) => (
            <button
              key={p.width}
              type="button"
              onClick={() => setDisplayWidth(p.width)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                displayWidth === p.width
                  ? "bg-gray-800 text-white border-gray-800"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min={200}
            max={1200}
            step={50}
            value={displayWidth}
            onChange={(e) => setDisplayWidth(Number(e.target.value))}
            className="flex-1"
          />
          <span className="text-xs text-gray-500 tabular-nums w-16 text-left">{displayWidth}px</span>
        </div>
      </div>

      {/* Label + expiry */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">כותרת (אופציונלי)</label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder='לדוגמה: "מודעת בר מצווה"'
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">תפוגה</label>
          <input
            type="date"
            value={expires}
            onChange={(e) => setExpires(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:border-gray-400"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={!preview}
        className="w-full bg-gray-800 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        העלה מודעה
      </button>
    </form>
  );
}

// ─── Main component ─────────────────────────────────────────────────────────

export function ImageAnnouncementUploader({
  images,
  onSave,
  onDelete,
  onUpdateSize,
}: {
  images: ImageAnnouncement[];
  onSave: (img: ImageAnnouncement) => void;
  onDelete: (id: string) => void;
  onUpdateSize: (id: string, width: number) => void;
}) {
  return (
    <div className="space-y-4">
      <UploadForm onSave={onSave} />

      {images.length > 0 && (
        <div className="bg-white rounded-2xl shadow p-4" dir="rtl">
          <h3 className="font-bold text-lg text-gray-700 mb-3">מודעות תמונה פעילות</h3>
          <div className="space-y-3">
            {images.map((img) => (
              <div
                key={img.id}
                className="border border-gray-100 rounded-xl p-3 space-y-2"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={img.imageData}
                    alt={img.label ?? "מודעה"}
                    className="w-20 h-20 object-cover rounded-lg border border-gray-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    {img.label && (
                      <p className="text-sm font-medium text-gray-700">{img.label}</p>
                    )}
                    <p className="text-xs text-gray-400">רוחב: {img.displayWidth}px</p>
                    {img.expiresAt && (
                      <p className="text-xs text-gray-400">
                        תפוגה: {new Date(img.expiresAt).toLocaleDateString("he-IL")}
                      </p>
                    )}
                    {/* Inline size adjuster */}
                    <div className="flex items-center gap-2 mt-1.5">
                      <input
                        type="range"
                        min={200}
                        max={1200}
                        step={50}
                        value={img.displayWidth}
                        onChange={(e) => onUpdateSize(img.id, Number(e.target.value))}
                        className="flex-1"
                      />
                      <span className="text-xs text-gray-500 tabular-nums w-14 text-left">{img.displayWidth}px</span>
                    </div>
                  </div>
                  <button
                    onClick={() => onDelete(img.id)}
                    className="text-red-400 hover:text-red-600 shrink-0 p-1"
                    aria-label="מחק"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
