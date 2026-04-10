"use client";
import React from "react";
import type {
  Block, TimesContent, LessonContent, AnnouncementContent,
  ClockContent, BannerContent, ZmanimSummaryContent, ParashaContent,
  ImageContent, CountdownContent, DividerContent, SpacerContent,
} from "@/types/block";
import type { KehilaLocation } from "@/types/kehila";
import type { ZmanimDisplay } from "@/templates/types";
import { TimesBlockRenderer } from "./TimesBlockRenderer";
import { LessonBlockRenderer } from "./LessonBlockRenderer";
import { AnnouncementBlockRenderer } from "./AnnouncementBlockRenderer";
import { ClockAnalogRenderer } from "./ClockAnalogRenderer";
import { ClockDigitalRenderer } from "./ClockDigitalRenderer";
import { BannerBlockRenderer } from "./BannerBlockRenderer";
import { ZmanimSummaryRenderer } from "./ZmanimSummaryRenderer";
import { ParashaRenderer } from "./ParashaRenderer";
import { ImageRenderer } from "./ImageRenderer";
import { CountdownRenderer } from "./CountdownRenderer";
import { DividerRenderer } from "./DividerRenderer";
import { SpacerRenderer } from "./SpacerRenderer";

export function BlockRenderer({
  block,
  location,
  zmanim,
  className,
}: {
  block: Block;
  location: KehilaLocation;
  zmanim?: ZmanimDisplay;
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
    case "zmanim-summary":
      return <ZmanimSummaryRenderer content={block.content as ZmanimSummaryContent} zmanim={zmanim} className={className} />;
    case "parasha":
      return <ParashaRenderer content={block.content as ParashaContent} zmanim={zmanim} className={className} />;
    case "image":
      return <ImageRenderer content={block.content as ImageContent} className={className} />;
    case "countdown":
      return <CountdownRenderer content={block.content as CountdownContent} className={className} />;
    case "divider":
      return <DividerRenderer content={block.content as DividerContent} className={className} />;
    case "spacer":
      return <SpacerRenderer content={block.content as SpacerContent} />;
    default:
      return null;
  }
}
