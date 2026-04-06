import type { Time } from "./items";

// ─── Block types ─────────────────────────────────────────────────────────────

export type BlockType =
  | "times"
  | "lesson"
  | "announcement"
  | "clock-analog"
  | "clock-digital"
  | "banner";

export type ColumnPosition = "right" | "middle" | "left";

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

// ─── Block ───────────────────────────────────────────────────────────────────

export interface Block {
  id: string;
  type: BlockType;
  col: ColumnPosition;
  index: number;
  visibility: VisibilityRule;
  content: TimesContent | LessonContent | AnnouncementContent | ClockContent | BannerContent;
}

// Type-safe helpers
export interface TimesBlock extends Block {
  type: "times";
  content: TimesContent;
}
export interface LessonBlock extends Block {
  type: "lesson";
  content: LessonContent;
}
export interface AnnouncementBlock extends Block {
  type: "announcement";
  content: AnnouncementContent;
}
export interface ClockAnalogBlock extends Block {
  type: "clock-analog";
  content: ClockContent;
}
export interface ClockDigitalBlock extends Block {
  type: "clock-digital";
  content: ClockContent;
}
export interface BannerBlock extends Block {
  type: "banner";
  content: BannerContent;
}
