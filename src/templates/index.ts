import type { TemplateId } from "@/types/kehila";
import type { TemplateProps } from "./types";
import type { ComponentType } from "react";

export { ClassicTemplate }     from "./ClassicTemplate";
export { ModernTemplate }      from "./ModernTemplate";
export { LedTemplate }         from "./LedTemplate";
export { SephardicTemplate }   from "./SephardicTemplate";
export { ParchmentTemplate }   from "./ParchmentTemplate";
export { NightTemplate }       from "./NightTemplate";
export { GoldenTemplate }      from "./GoldenTemplate";
export { RoyalBlueTemplate }   from "./RoyalBlueTemplate";
export { MarbleTemplate }      from "./MarbleTemplate";
export { WoodTemplate }        from "./WoodTemplate";
export type { TemplateProps, ZmanimDisplay } from "./types";

export const TEMPLATE_META: Record<TemplateId, { label: string; description: string; preview: string }> = {
  classic:   { label: "קלאסי",          description: "רקע תמונה, זהב ולבן, מסורתי",              preview: "🏛️" },
  modern:    { label: "מודרני",          description: "כרטיסים לבנים, צבע מותאם",                preview: "🎨" },
  led:       { label: "LED / טלוויזיה", description: "שחור וירוק, מסך שלט דיגיטלי",             preview: "📟" },
  mobile:    { label: "מובייל",          description: "עמוד צר, גדול וברור לנייד",               preview: "📱" },
  sephardic: { label: "ספרדי",           description: "בורדו ואדום, קישוטים מרוקאיים",            preview: "🔷" },
  parchment: { label: "קלף",             description: "גוילי עתיק, חום-זהב, כתב יד",             preview: "📜" },
  night:     { label: "לילה כוכבים",    description: "כחול כהה, כסף, שמי לילה",                 preview: "🌙" },
  golden:      { label: "זהב",             description: "שחור ופרמיום, טקסט זהב מבריק",            preview: "✨" },
  "royal-blue": { label: "כחול מלכותי",   description: "כחול כהה עם זהב, ירושלים של מעלה",      preview: "👑" },
  marble:      { label: "שיש לבן",        description: "לבן אלגנטי, מינימליסטי ונקי",            preview: "🏛️" },
  wood:        { label: "עץ מסורתי",      description: "חום עץ חם, סגנון ארון קודש",              preview: "🪵" },
};

export type TemplateCmp = ComponentType<TemplateProps>;

export function getTemplateCmp(id: TemplateId): Promise<TemplateCmp> {
  switch (id) {
    case "classic":   return import("./ClassicTemplate").then((m) => m.ClassicTemplate);
    case "modern":    return import("./ModernTemplate").then((m) => m.ModernTemplate);
    case "led":       return import("./LedTemplate").then((m) => m.LedTemplate);
    case "sephardic": return import("./SephardicTemplate").then((m) => m.SephardicTemplate);
    case "parchment": return import("./ParchmentTemplate").then((m) => m.ParchmentTemplate);
    case "night":     return import("./NightTemplate").then((m) => m.NightTemplate);
    case "golden":      return import("./GoldenTemplate").then((m) => m.GoldenTemplate);
    case "royal-blue":  return import("./RoyalBlueTemplate").then((m) => m.RoyalBlueTemplate);
    case "marble":      return import("./MarbleTemplate").then((m) => m.MarbleTemplate);
    case "wood":        return import("./WoodTemplate").then((m) => m.WoodTemplate);
    case "mobile":
    default:            return import("./ClassicTemplate").then((m) => m.ClassicTemplate);
  }
}
