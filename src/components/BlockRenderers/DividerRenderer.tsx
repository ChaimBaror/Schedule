"use client";
import React from "react";
import type { DividerContent } from "@/types/block";

export function DividerRenderer({
  content,
  className,
}: {
  content: DividerContent;
  className?: string;
}) {
  if (content.style === "dots") {
    return (
      <div className={`flex items-center justify-center gap-2 py-2 ${className ?? ""}`}>
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} className="w-1.5 h-1.5 rounded-full bg-current opacity-30" />
        ))}
      </div>
    );
  }

  if (content.style === "ornament") {
    return (
      <div className={`flex items-center justify-center gap-3 py-2 ${className ?? ""}`}>
        <span className="h-px flex-1 max-w-16 bg-current opacity-20" />
        <span className="opacity-40 text-sm">✦</span>
        <span className="h-px flex-1 max-w-16 bg-current opacity-20" />
      </div>
    );
  }

  // line
  return (
    <div className={`py-2 ${className ?? ""}`}>
      <div className="h-px bg-current opacity-15" />
    </div>
  );
}
