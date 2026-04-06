"use client";
import React from "react";
import type { Block, TimesContent, LessonContent, AnnouncementContent, ClockContent, BannerContent } from "@/types/block";
import type { KehilaLocation } from "@/types/kehila";
import { TimesBlockRenderer } from "./TimesBlockRenderer";
import { LessonBlockRenderer } from "./LessonBlockRenderer";
import { AnnouncementBlockRenderer } from "./AnnouncementBlockRenderer";
import { ClockAnalogRenderer } from "./ClockAnalogRenderer";
import { ClockDigitalRenderer } from "./ClockDigitalRenderer";
import { BannerBlockRenderer } from "./BannerBlockRenderer";

export function BlockRenderer({
  block,
  location,
  className,
}: {
  block: Block;
  location: KehilaLocation;
  className?: string;
}) {
  switch (block.type) {
    case "times":
      return <TimesBlockRenderer content={block.content as TimesContent} location={location} className={className} />;
    case "lesson":
      return <LessonBlockRenderer content={block.content as LessonContent} className={className} />;
    case "announcement":
      return <AnnouncementBlockRenderer content={block.content as AnnouncementContent} className={className} />;
    case "clock-analog":
      return <ClockAnalogRenderer content={block.content as ClockContent} className={className} />;
    case "clock-digital":
      return <ClockDigitalRenderer content={block.content as ClockContent} className={className} />;
    case "banner":
      return <BannerBlockRenderer content={block.content as BannerContent} className={className} />;
    default:
      return null;
  }
}
