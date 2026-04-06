"use client";
import React, { useEffect, useState } from "react";
import { useTemplate } from "@/context/TemplateContext";
import { dataFetch, getTimeList } from "@/services/time.service";
import { buildZmanimDisplay } from "@/utils/zmanim-display";
import { DEFAULT_LOCATION } from "@/services/hebcal.service";
import type { Item } from "@/types/items";
import type { ZmanimDisplay } from "@/templates/types";
import type { Kehila } from "@/types/kehila";

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

// Default kehila for the main dashboard
const DEFAULT_KEHILA: Kehila = {
  slug: "default",
  name: "בית הכנסת",
  city: "בני ברק",
  location: DEFAULT_LOCATION,
  templateId: "classic",
  primaryColor: "#1e40af",
};

export default function TemplateDashboard() {
  const { templateId } = useTemplate();

  const [right,  setRight]  = useState<Item[]>(getTimeList().Right);
  const [medium, setMedium] = useState<Item[]>(getTimeList().Medium);
  const [left,   setLeft]   = useState<Item[]>(getTimeList().Left);
  const [zmanim, setZmanim] = useState<ZmanimDisplay | null>(null);
  const [loading, setLoading] = useState(false);

  // Build zmanim once on mount and refresh every minute
  useEffect(() => {
    setZmanim(buildZmanimDisplay(DEFAULT_LOCATION));
    const t = setInterval(() => setZmanim(buildZmanimDisplay(DEFAULT_LOCATION)), 60_000);
    return () => clearInterval(t);
  }, []);

  // Fetch items
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await dataFetch();
        if (data) {
          setRight(data.right   ?? getTimeList().Right);
          setMedium(data.medium ?? getTimeList().Medium);
          setLeft(data.left     ?? getTimeList().Left);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (!zmanim || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white" />
      </div>
    );
  }

  const props = {
    kehila: DEFAULT_KEHILA,
    itemsRight:  right,
    itemsMiddle: medium,
    itemsLeft:   left,
    announcements: [],
    zmanim,
    isKiosk: false,
  };

  switch (templateId) {
    case "modern":      return <ModernTemplate      {...props} />;
    case "led":         return <LedTemplate         {...props} />;
    case "sephardic":   return <SephardicTemplate   {...props} />;
    case "parchment":   return <ParchmentTemplate   {...props} />;
    case "night":       return <NightTemplate       {...props} />;
    case "golden":      return <GoldenTemplate      {...props} />;
    case "royal-blue":  return <RoyalBlueTemplate   {...props} />;
    case "marble":      return <MarbleTemplate      {...props} />;
    case "wood":        return <WoodTemplate        {...props} />;
    default:            return <ClassicTemplate     {...props} />;
  }
}
