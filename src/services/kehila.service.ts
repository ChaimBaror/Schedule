import type { Kehila, Announcement, KehilaState } from "@/types/kehila";
import { Right, Medium, Left } from "@/services/data";
import type { Item } from "@/types/items";
import type { Block, ColumnPosition } from "@/types/block";
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

export function getKehilaState(slug: string): KehilaState | null {
  const kehila = getKehilaBySlug(slug);
  if (!kehila) return null;
  return {
    kehila,
    announcements: getKehilaAnnouncements(slug),
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
