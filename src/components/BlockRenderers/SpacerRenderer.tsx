"use client";
import React from "react";
import type { SpacerContent } from "@/types/block";

export function SpacerRenderer({ content }: { content: SpacerContent }) {
  return <div style={{ height: `${content.height}px` }} />;
}
