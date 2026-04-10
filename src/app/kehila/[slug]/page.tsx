"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getKehilaState, getKehilaItems, getKehilaBlocks, getTodayOverride } from "@/services/kehila.service";
import { buildZmanimDisplay } from "@/utils/zmanim-display";
import type { KehilaState } from "@/types/kehila";
import type { ZmanimDisplay } from "@/templates/types";
import type { Item } from "@/types/items";
import type { Block, TimesContent, ImageContent } from "@/types/block";
import type { DayOverride, DayAnnouncement } from "@/types/dayOverride";
import type { Announcement, ImageAnnouncement } from "@/types/kehila";
import { ClassicTemplate }     from "@/templates/ClassicTemplate";
import { ModernTemplate }      from "@/templates/ModernTemplate";
import { LedTemplate }         from "@/templates/LedTemplate";
import { SephardicTemplate }   from "@/templates/SephardicTemplate";
import { ParchmentTemplate }   from "@/templates/ParchmentTemplate";
import { NightTemplate }       from "@/templates/NightTemplate";
import { GoldenTemplate }      from "@/templates/GoldenTemplate";
import { RoyalBlueTemplate }   from "@/templates/RoyalBlueTemplate";
import { MarbleTemplate }      from "@/templates/MarbleTemplate";
import { WoodTemplate }        from "@/templates/WoodTemplate";

/** Convert day announcements to the global Announcement format */
function dayAnnouncementsToAnnouncements(dayAnns: DayAnnouncement[]): Announcement[] {
  return dayAnns.map((a, i) => ({
    id: `day-ann-${a.id}`,
    type: a.type,
    text: a.text,
    priority: a.type === "avel" ? 0 : a.type === "simcha" ? 1 : 2,
  }));
}

/** Convert image announcements to centered image blocks */
function imageAnnouncementsToBlocks(images: ImageAnnouncement[]): Block[] {
  return images.map((img, i) => ({
    id: `img-ann-${img.id}`,
    type: "image" as const,
    col: "full" as const,
    span: 3 as const,
    index: i,
    visibility: { rule: "always" as const },
    content: {
      url: img.imageData,
      alt: img.label ?? "מודעה",
      maxWidth: img.displayWidth,
    } satisfies ImageContent,
  }));
}

/** Convert a DayOverride into Block[] that templates can render */
function dayOverrideToBlocks(override: DayOverride): Block[] {
  return override.items.map((item, i) => ({
    id: `day-override-${item.id}`,
    type: "times" as const,
    col: "right" as const,
    index: i,
    visibility: { rule: "always" as const },
    content: {
      title: item.title,
      times: item.times.map((val) => ({ val })),
      description: override.note,
    } satisfies TimesContent,
  }));
}

export default function KehilaKioskPage() {
  const { slug } = useParams<{ slug: string }>();
  const [state, setState]   = useState<KehilaState | null>(null);
  const [items, setItems]   = useState<{ right: Item[]; medium: Item[]; left: Item[] } | null>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [mergedAnnouncements, setMergedAnnouncements] = useState<Announcement[]>([]);
  const [zmanim, setZmanim] = useState<ZmanimDisplay | null>(null);
  const [error, setError]   = useState(false);

  useEffect(() => {
    const s = getKehilaState(slug);
    if (!s) { setError(true); return; }
    setState(s);
    setItems(getKehilaItems(slug));

    // Load blocks and announcements, merge day-specific overrides if today has one
    const baseBlocks = getKehilaBlocks(slug);
    const todayOverride = getTodayOverride(slug);

    // Collect extra blocks: day overrides + image announcements
    const extraBlocks: Block[] = [];

    if (todayOverride) {
      if (todayOverride.items.length > 0) {
        extraBlocks.push(...dayOverrideToBlocks(todayOverride));
      }
      const dayAnns = todayOverride.announcements?.length
        ? dayAnnouncementsToAnnouncements(todayOverride.announcements)
        : [];
      setMergedAnnouncements([...dayAnns, ...s.announcements]);
    } else {
      setMergedAnnouncements(s.announcements);
    }

    // Image announcements → centered image blocks
    if (s.imageAnnouncements.length > 0) {
      extraBlocks.push(...imageAnnouncementsToBlocks(s.imageAnnouncements));
    }

    setBlocks([...extraBlocks, ...baseBlocks]);

    setZmanim(buildZmanimDisplay(s.kehila.location));
  }, [slug]);

  useEffect(() => {
    if (!state) return;
    const t = setInterval(() => setZmanim(buildZmanimDisplay(state.kehila.location)), 60_000);
    return () => clearInterval(t);
  }, [state]);

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white" dir="rtl">
      <div className="text-center">
        <p className="text-2xl font-bold mb-2">הקהילה לא נמצאה</p>
        <p className="text-gray-400">הכתובת <span className="font-mono text-yellow-300">{slug}</span> אינה קיימת</p>
      </div>
    </div>
  );

  if (!state || !items || !zmanim) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white" />
    </div>
  );

  const p = { kehila: state.kehila, itemsRight: items.right, itemsMiddle: items.medium, itemsLeft: items.left, announcements: mergedAnnouncements, zmanim, isKiosk: true, blocks, displaySettings: state.displaySettings };

  switch (state.kehila.templateId) {
    case "modern":      return <ModernTemplate      {...p} />;
    case "led":         return <LedTemplate         {...p} />;
    case "sephardic":   return <SephardicTemplate   {...p} />;
    case "parchment":   return <ParchmentTemplate   {...p} />;
    case "night":       return <NightTemplate       {...p} />;
    case "golden":      return <GoldenTemplate      {...p} />;
    case "royal-blue":  return <RoyalBlueTemplate   {...p} />;
    case "marble":      return <MarbleTemplate      {...p} />;
    case "wood":        return <WoodTemplate        {...p} />;
    default:            return <ClassicTemplate      {...p} />;
  }
}
