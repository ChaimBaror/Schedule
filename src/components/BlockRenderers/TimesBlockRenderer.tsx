"use client";
import React from "react";
import type { TimesContent } from "@/types/block";
import type { KehilaLocation } from "@/types/kehila";
import { calcTime } from "@/templates/calcTime";

export function TimesBlockRenderer({
  content,
  location,
  className,
}: {
  content: TimesContent;
  location: KehilaLocation;
  className?: string;
}) {
  return (
    <div className={className}>
      <h3 className="font-bold text-lg mb-2">{content.title}</h3>
      <ul className="space-y-1">
        {content.times.map((t, i) => (
          <li key={i} className="flex justify-between items-center">
            {t.name && <span className="text-sm opacity-80">{t.name}</span>}
            <span className="font-mono">{calcTime(t, location)}</span>
          </li>
        ))}
      </ul>
      {content.description && (
        <p className="text-xs opacity-70 mt-2">{content.description}</p>
      )}
    </div>
  );
}
