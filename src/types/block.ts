import type { Time } from "./items";

// ─── Block types ─────────────────────────────────────────────────────────────

export type BlockType =
  | "times"
  | "lesson"
  | "announcement"
  | "clock-analog"
  | "clock-digital"
  | "banner"
  | "zmanim-summary"
  | "parasha"
  | "image"
  | "countdown"
  | "divider"
  | "spacer";

export type ColumnPosition = "right" | "middle" | "left" | "full";

/** How many columns this block spans */
export type BlockSpan = 1 | 2 | 3;

// ─── Visibility rules ────────────────────────────────────────────────────────

export interface VisibilityRule {
  /** When to show this block */
  rule: "always" | "days" | "date-range" | "before-shabbat";
  /** Days of week: 0=Sunday … 5=Friday, 6=Saturday */
  days?: number[];
  /** ISO date strings */
  fromDate?: string;
  toDate?: string;
  /** Show block X hours before shabbat enters */
  hoursBeforeShabbat?: number;
}

// ─── Content per block type ──────────────────────────────────────────────────

export interface TimesContent {
  title: string;
  times: Time[];
  description?: string;
}

export interface LessonContent {
  title: string;
  teacher?: string;
  time: string;
  location?: string;
  description?: string;
}

export interface AnnouncementContent {
  title: string;
  text: string;
}

export interface ClockContent {
  label?: string;
  showSeconds?: boolean;
}

export interface BannerContent {
  text: string;
}

export interface ZmanimSummaryContent {
  /** Which zmanim fields to show */
  fields: ("sunrise" | "sofZmanShma" | "chatzot" | "minchaGedola" | "shkiah" | "candleLighting" | "shabbatEnd")[];
  title?: string;
}

export interface ParashaContent {
  /** Show parasha, hebrew date, or both */
  show: "parasha" | "date" | "both";
}

export interface ImageContent {
  url: string;
  alt?: string;
  /** max height in px */
  maxHeight?: number;
  /** max width in px */
  maxWidth?: number;
}

export interface CountdownContent {
  /** Event label */
  label: string;
  /** ISO date string of the target */
  targetDate: string;
  /** Show days/hours/minutes */
  showDays?: boolean;
  showHours?: boolean;
  showMinutes?: boolean;
}

export interface DividerContent {
  style: "line" | "dots" | "ornament";
}

export interface SpacerContent {
  /** Height in px */
  height: number;
}

// ─── Block ───────────────────────────────────────────────────────────────────

export interface Block {
  id: string;
  type: BlockType;
  col: ColumnPosition;
  /** How many columns this block spans (1 = default, 2, 3 = full row) */
  span?: BlockSpan;
  index: number;
  visibility: VisibilityRule;
  content:
    | TimesContent
    | LessonContent
    | AnnouncementContent
    | ClockContent
    | BannerContent
    | ZmanimSummaryContent
    | ParashaContent
    | ImageContent
    | CountdownContent
    | DividerContent
    | SpacerContent;
}

// Type-safe helpers
export interface TimesBlock extends Block { type: "times"; content: TimesContent; }
export interface LessonBlock extends Block { type: "lesson"; content: LessonContent; }
export interface AnnouncementBlock extends Block { type: "announcement"; content: AnnouncementContent; }
export interface ClockAnalogBlock extends Block { type: "clock-analog"; content: ClockContent; }
export interface ClockDigitalBlock extends Block { type: "clock-digital"; content: ClockContent; }
export interface BannerBlock extends Block { type: "banner"; content: BannerContent; }
export interface ZmanimSummaryBlock extends Block { type: "zmanim-summary"; content: ZmanimSummaryContent; }
export interface ParashaBlock extends Block { type: "parasha"; content: ParashaContent; }
export interface ImageBlock extends Block { type: "image"; content: ImageContent; }
export interface CountdownBlock extends Block { type: "countdown"; content: CountdownContent; }
export interface DividerBlock extends Block { type: "divider"; content: DividerContent; }
export interface SpacerBlock extends Block { type: "spacer"; content: SpacerContent; }
