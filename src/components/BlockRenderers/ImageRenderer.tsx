"use client";
import React from "react";
import type { ImageContent } from "@/types/block";

export function ImageRenderer({
  content,
  className,
}: {
  content: ImageContent;
  className?: string;
}) {
  if (!content.url) return null;

  return (
    <div className={`flex justify-center ${className ?? ""}`}>
      <img
        src={content.url}
        alt={content.alt ?? ""}
        className="object-contain rounded-lg"
        style={{
          maxHeight: content.maxHeight ? `${content.maxHeight}px` : "200px",
          ...(content.maxWidth ? { maxWidth: `${content.maxWidth}px`, width: "100%" } : {}),
        }}
      />
    </div>
  );
}
