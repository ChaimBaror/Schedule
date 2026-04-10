"use client";
import React from "react";
import type { ParashaContent } from "@/types/block";
import type { ZmanimDisplay } from "@/templates/types";

export function ParashaRenderer({
  content,
  zmanim,
  className,
}: {
  content: ParashaContent;
  zmanim?: ZmanimDisplay;
  className?: string;
}) {
  if (!zmanim) return null;

  return (
    <div className={`text-center ${className ?? ""}`}>
      {(content.show === "date" || content.show === "both") && (
        <p className="font-bold text-lg">{zmanim.hebrewDate}</p>
      )}
      {(content.show === "parasha" || content.show === "both") && zmanim.parasha && (
        <p className="font-semibold text-base opacity-80 mt-1">{zmanim.parasha}</p>
      )}
    </div>
  );
}
