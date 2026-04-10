"use client";
import React from "react";
import type { AnnouncementContent } from "@/types/block";

export function AnnouncementBlockRenderer({
  content,
  className,
}: {
  content: AnnouncementContent;
  className?: string;
}) {
  return (
    <div className={className}>
      <h3 className="font-bold text-lg mb-1">{content.title}</h3>
      <p className="text-sm whitespace-pre-line">{content.text}</p>
    </div>
  );
}
