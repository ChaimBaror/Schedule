"use client";
import React from "react";
import type { LessonContent } from "@/types/block";

export function LessonBlockRenderer({
  content,
  className,
}: {
  content: LessonContent;
  className?: string;
}) {
  return (
    <div className={className}>
      <h3 className="font-bold text-lg mb-1">{content.title}</h3>
      {content.teacher && <p className="text-sm opacity-80">{content.teacher}</p>}
      <p className="font-mono text-lg mt-1">{content.time}</p>
      {content.location && <p className="text-xs opacity-70 mt-1">{content.location}</p>}
      {content.description && <p className="text-xs opacity-70 mt-1">{content.description}</p>}
    </div>
  );
}
