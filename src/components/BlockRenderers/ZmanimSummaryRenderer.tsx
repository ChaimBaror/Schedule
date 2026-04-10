"use client";
import React from "react";
import type { ZmanimSummaryContent } from "@/types/block";
import type { ZmanimDisplay } from "@/templates/types";

const FIELD_LABELS: Record<string, string> = {
  sunrise: "זריחה",
  sofZmanShma: 'סוף ק"ש',
  chatzot: "חצות",
  minchaGedola: "מנחה גדולה",
  shkiah: "שקיעה",
  candleLighting: "הדלקת נרות",
  shabbatEnd: "צאת שבת",
};

export function ZmanimSummaryRenderer({
  content,
  zmanim,
  className,
}: {
  content: ZmanimSummaryContent;
  zmanim?: ZmanimDisplay;
  className?: string;
}) {
  if (!zmanim) return null;

  return (
    <div className={className}>
      {content.title && <h3 className="font-bold text-lg mb-2 text-center">{content.title}</h3>}
      <div className="space-y-1">
        {content.fields.map((field) => (
          <div key={field} className="flex items-baseline justify-between gap-2">
            <span className="text-sm opacity-70">{FIELD_LABELS[field] ?? field}</span>
            <span className="font-bold tabular-nums">{(zmanim as unknown as Record<string, string>)[field] ?? ""}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
