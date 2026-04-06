"use client";
import React from "react";
import type { BannerContent } from "@/types/block";

export function BannerBlockRenderer({
  content,
  className,
}: {
  content: BannerContent;
  className?: string;
}) {
  return (
    <div className={`text-center py-3 px-4 font-bold text-lg ${className ?? ""}`}>
      {content.text}
    </div>
  );
}
