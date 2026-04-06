"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getKehilaState, getKehilaItems, getKehilaBlocks } from "@/services/kehila.service";
import { buildZmanimDisplay } from "@/utils/zmanim-display";
import type { KehilaState } from "@/types/kehila";
import type { ZmanimDisplay } from "@/templates/types";
import type { Item } from "@/types/items";
import type { Block } from "@/types/block";
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

export default function KehilaKioskPage() {
  const { slug } = useParams<{ slug: string }>();
  const [state, setState]   = useState<KehilaState | null>(null);
  const [items, setItems]   = useState<{ right: Item[]; medium: Item[]; left: Item[] } | null>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [zmanim, setZmanim] = useState<ZmanimDisplay | null>(null);
  const [error, setError]   = useState(false);

  useEffect(() => {
    const s = getKehilaState(slug);
    if (!s) { setError(true); return; }
    setState(s);
    setItems(getKehilaItems(slug));
    setBlocks(getKehilaBlocks(slug));
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

  const p = { kehila: state.kehila, itemsRight: items.right, itemsMiddle: items.medium, itemsLeft: items.left, announcements: state.announcements, zmanim, isKiosk: true, blocks };

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
