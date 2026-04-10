import type { Kehila, Announcement, ImageAnnouncement, KehilaState, DisplaySettings } from "@/types/kehila";
import { DEFAULT_DISPLAY_SETTINGS } from "@/types/kehila";
import { Right, Medium, Left } from "@/services/data";
import type { Item } from "@/types/items";
import type { Block, ColumnPosition } from "@/types/block";
import type { DayOverride } from "@/types/dayOverride";
import { CITIES } from "@/services/hebcal.service";

// ─── Demo data ────────────────────────────────────────────────────────────────
// In production replace with Supabase / DB calls.

const DEMO_KEHILOT: Kehila[] = [
  {
    slug: "ichud-bnei-brak",
    name: 'בית כנסת איחוד',
    city: "בני ברק",
    location: CITIES["bnei-brak"],
    templateId: "classic",
    primaryColor: "#92400e",
  },
  {
    slug: "ohel-moshe-jerusalem",
    name: "אוהל משה",
    city: "ירושלים",
    location: CITIES["jerusalem"],
    templateId: "modern",
    primaryColor: "#1e3a5f",
  },
  {
    slug: "neve-shalom-jerusalem",
    name: "נווה שלום",
    city: "ירושלים",
    location: CITIES["jerusalem"],
    templateId: "led",
    primaryColor: "#064e3b",
  },
];

const DEMO_ANNOUNCEMENTS: Record<string, Announcement[]> = {
  "ichud-bnei-brak": [
    { id: "1", type: "simcha", text: "מזל טוב לאברהם ושרה לרגל הבר מצווה של בנם יצחק", priority: 1 },
    { id: "2", type: "notice", text: "שיעור גמרא בראש חודש בשעה 20:30", priority: 2 },
  ],
  "ohel-moshe-jerusalem": [
    { id: "3", type: "avel", text: "הספד לעילוי נשמת ר' משה בן יצחק ז\"ל", priority: 1 },
  ],
  "neve-shalom-jerusalem": [],
};

// Items per kehila — in production load from DB
const DEMO_ITEMS: Record<string, { right: Item[]; medium: Item[]; left: Item[] }> = {};

function getDefaultItems() {
  return { right: [...Right], medium: [...Medium], left: [...Left] };
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function getAllKehilot(): Kehila[] {
  return DEMO_KEHILOT;
}

export function getKehilaBySlug(slug: string): Kehila | null {
  return DEMO_KEHILOT.find((k) => k.slug === slug) ?? null;
}

export function getKehilaItems(slug: string) {
  return DEMO_ITEMS[slug] ?? getDefaultItems();
}

export function getKehilaAnnouncements(slug: string): Announcement[] {
  return DEMO_ANNOUNCEMENTS[slug] ?? [];
}

const DEMO_DISPLAY_SETTINGS: Record<string, DisplaySettings> = {};

export function getKehilaDisplaySettings(slug: string): DisplaySettings {
  return DEMO_DISPLAY_SETTINGS[slug] ?? { ...DEFAULT_DISPLAY_SETTINGS };
}

export function saveKehilaDisplaySettings(slug: string, settings: DisplaySettings): void {
  DEMO_DISPLAY_SETTINGS[slug] = settings;
}

export function getKehilaState(slug: string): KehilaState | null {
  const kehila = getKehilaBySlug(slug);
  if (!kehila) return null;
  return {
    kehila,
    announcements: getKehilaAnnouncements(slug),
    imageAnnouncements: getImageAnnouncements(slug),
    displaySettings: getKehilaDisplaySettings(slug),
  };
}

export function saveAnnouncement(slug: string, ann: Announcement): void {
  if (!DEMO_ANNOUNCEMENTS[slug]) DEMO_ANNOUNCEMENTS[slug] = [];
  const idx = DEMO_ANNOUNCEMENTS[slug].findIndex((a) => a.id === ann.id);
  if (idx >= 0) DEMO_ANNOUNCEMENTS[slug][idx] = ann;
  else DEMO_ANNOUNCEMENTS[slug].push(ann);
}

export function deleteAnnouncement(slug: string, id: string): void {
  if (!DEMO_ANNOUNCEMENTS[slug]) return;
  DEMO_ANNOUNCEMENTS[slug] = DEMO_ANNOUNCEMENTS[slug].filter((a) => a.id !== id);
}

export function updateKehilaTemplate(slug: string, templateId: Kehila["templateId"]): void {
  const k = DEMO_KEHILOT.find((k) => k.slug === slug);
  if (k) k.templateId = templateId;
}

export function updateKehilaLogo(slug: string, logoUrl: string): void {
  const k = DEMO_KEHILOT.find((k) => k.slug === slug);
  if (k) k.logoUrl = logoUrl || undefined;
}

// ─── Blocks ──────────────────────────────────────────────────────────────────

/** Convert legacy Item[] columns into Block[] */
function itemsToBlocks(items: { right: Item[]; medium: Item[]; left: Item[] }): Block[] {
  const convert = (list: Item[], col: ColumnPosition): Block[] =>
    list.map((item, i) => ({
      id: String(item._id),
      type: "times" as const,
      col,
      index: i,
      visibility: { rule: "always" as const },
      content: {
        title: item.title,
        times: item.times,
        description: item.description,
      },
    }));

  return [
    ...convert(items.right, "right"),
    ...convert(items.medium, "middle"),
    ...convert(items.left, "left"),
  ];
}

const DEMO_BLOCKS: Record<string, Block[]> = {};

function getDefaultBlocks(): Block[] {
  return itemsToBlocks({ right: [...Right], medium: [...Medium], left: [...Left] });
}

export function getKehilaBlocks(slug: string): Block[] {
  return DEMO_BLOCKS[slug] ?? getDefaultBlocks();
}

export function saveKehilaBlocks(slug: string, blocks: Block[]): void {
  DEMO_BLOCKS[slug] = blocks;
}

export function saveBlock(slug: string, block: Block): void {
  if (!DEMO_BLOCKS[slug]) DEMO_BLOCKS[slug] = getDefaultBlocks();
  const idx = DEMO_BLOCKS[slug].findIndex((b) => b.id === block.id);
  if (idx >= 0) DEMO_BLOCKS[slug][idx] = block;
  else DEMO_BLOCKS[slug].push(block);
}

export function deleteBlock(slug: string, blockId: string): void {
  if (!DEMO_BLOCKS[slug]) return;
  DEMO_BLOCKS[slug] = DEMO_BLOCKS[slug].filter((b) => b.id !== blockId);
}

// ─── Day Overrides ──────────────────────────────────────────────────────────

const DEMO_DAY_OVERRIDES: Record<string, DayOverride[]> = {};

export function getDayOverrides(slug: string): DayOverride[] {
  return DEMO_DAY_OVERRIDES[slug] ?? [];
}

export function getDayOverride(slug: string, date: string): DayOverride | null {
  const overrides = DEMO_DAY_OVERRIDES[slug] ?? [];
  return overrides.find((o) => o.date === date) ?? null;
}

export function getTodayOverride(slug: string): DayOverride | null {
  const today = new Date().toISOString().slice(0, 10);
  return getDayOverride(slug, today);
}

export function saveDayOverride(slug: string, override: DayOverride): void {
  if (!DEMO_DAY_OVERRIDES[slug]) DEMO_DAY_OVERRIDES[slug] = [];
  const idx = DEMO_DAY_OVERRIDES[slug].findIndex((o) => o.date === override.date);
  if (idx >= 0) DEMO_DAY_OVERRIDES[slug][idx] = override;
  else DEMO_DAY_OVERRIDES[slug].push(override);
}

export function deleteDayOverride(slug: string, date: string): void {
  if (!DEMO_DAY_OVERRIDES[slug]) return;
  DEMO_DAY_OVERRIDES[slug] = DEMO_DAY_OVERRIDES[slug].filter((o) => o.date !== date);
}

// ─── Image Announcements ────────────────────────────────────────────────────

const DEMO_IMAGE_ANNOUNCEMENTS: Record<string, ImageAnnouncement[]> = {};

export function getImageAnnouncements(slug: string): ImageAnnouncement[] {
  return DEMO_IMAGE_ANNOUNCEMENTS[slug] ?? [];
}

export function saveImageAnnouncement(slug: string, img: ImageAnnouncement): void {
  if (!DEMO_IMAGE_ANNOUNCEMENTS[slug]) DEMO_IMAGE_ANNOUNCEMENTS[slug] = [];
  const idx = DEMO_IMAGE_ANNOUNCEMENTS[slug].findIndex((a) => a.id === img.id);
  if (idx >= 0) DEMO_IMAGE_ANNOUNCEMENTS[slug][idx] = img;
  else DEMO_IMAGE_ANNOUNCEMENTS[slug].push(img);
}

export function deleteImageAnnouncement(slug: string, id: string): void {
  if (!DEMO_IMAGE_ANNOUNCEMENTS[slug]) return;
  DEMO_IMAGE_ANNOUNCEMENTS[slug] = DEMO_IMAGE_ANNOUNCEMENTS[slug].filter((a) => a.id !== id);
}
