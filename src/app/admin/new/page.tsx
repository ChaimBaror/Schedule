"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { createKehila, getKehilaBySlug, assignKehilaToUser } from "@/services/kehila.service";
import { CITIES } from "@/services/hebcal.service";
import { TEMPLATE_META } from "@/templates/index";
import type { Kehila, TemplateId } from "@/types/kehila";

const CITY_OPTIONS = Object.entries(CITIES).map(([key, loc]) => ({
  key,
  label: loc.cityName,
}));

const TEMPLATE_IDS = Object.keys(TEMPLATE_META) as TemplateId[];

function toSlug(name: string): string {
  return name
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9\u0590-\u05FF-]/g, "")
    .toLowerCase();
}

export default function NewKehilaPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/signin");
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-800" />
      </div>
    );
  }

  const [name, setName] = useState("");
  const [cityKey, setCityKey] = useState(CITY_OPTIONS[0].key);
  const [templateId, setTemplateId] = useState<TemplateId>("classic");
  const [primaryColor, setPrimaryColor] = useState("#1e3a5f");
  const [rabbi, setRabbi] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const slug = toSlug(name) || "kehila";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("נא להזין שם קהילה");
      return;
    }

    if (getKehilaBySlug(slug)) {
      setError(`קהילה עם הכתובת "${slug}" כבר קיימת. נסה שם אחר.`);
      return;
    }

    const city = CITIES[cityKey];
    const kehila: Kehila = {
      slug,
      name: name.trim(),
      city: city.cityName,
      location: city,
      templateId,
      primaryColor,
      rabbi: rabbi.trim() || undefined,
      phone: phone.trim() || undefined,
    };

    try {
      createKehila(kehila);
      // The creator becomes gabay for this kehila
      if (session?.user?.email) {
        assignKehilaToUser(session.user.email, slug);
        // Update session in-memory so the admin guard lets them in immediately
        if (session.user.kehilaSlugs) {
          session.user.kehilaSlugs.push(slug);
        } else {
          session.user.kehilaSlugs = [slug];
        }
        if (!session.user.role || session.user.role === "user") {
          session.user.role = "gabay";
        }
      }
      router.push(`/admin/${slug}`);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-start justify-center py-12 px-4" dir="rtl">
      <div className="w-full max-w-lg space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">יצירת קהילה חדשה</h1>
          <p className="text-sm text-gray-500 mt-1">מלא את הפרטים כדי ליצור לוח זמנים חדש לבית הכנסת שלך</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow p-6 space-y-5">
          {/* Name */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">שם בית הכנסת *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='לדוגמה: "בית כנסת המרכזי"'
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            />
            <p className="text-xs text-gray-400 mt-1">
              כתובת: <span className="font-mono text-gray-500">/kehila/{slug}</span>
            </p>
          </div>

          {/* City */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">עיר *</label>
            <select
              value={cityKey}
              onChange={(e) => setCityKey(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 bg-white"
            >
              {CITY_OPTIONS.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Template */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">עיצוב</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {TEMPLATE_IDS.map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTemplateId(id)}
                  className={`p-2.5 rounded-xl border text-right transition-all ${
                    templateId === id
                      ? "border-blue-500 bg-blue-50 shadow-sm"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="font-bold text-xs text-gray-800">{TEMPLATE_META[id].label}</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">{TEMPLATE_META[id].description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">צבע ראשי</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
              />
              <span className="text-xs text-gray-500 font-mono">{primaryColor}</span>
            </div>
          </div>

          {/* Optional fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">שם הרב (אופציונלי)</label>
              <input
                type="text"
                value={rabbi}
                onChange={(e) => setRabbi(e.target.value)}
                placeholder="הרב ישראל ישראלי"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">טלפון (אופציונלי)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="03-1234567"
                dir="ltr"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-2.5 text-sm">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-3 rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors"
          >
            צור קהילה
          </button>
        </form>
      </div>
    </div>
  );
}
