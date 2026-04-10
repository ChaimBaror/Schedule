/**
 * Day-specific schedule overrides.
 * A gabai can set custom times and announcements for a specific date,
 * which will be displayed on the board instead of the defaults.
 */

export interface DayTimeEntry {
  id: string;
  /** e.g. "שחרית", "מנחה" */
  title: string;
  /** Time values, e.g. ["06:15", "07:00"] */
  times: string[];
}

export type DayAnnouncementType = "simcha" | "avel" | "notice";

export interface DayAnnouncement {
  id: string;
  type: DayAnnouncementType;
  text: string;
}

export interface DayOverride {
  /** ISO date string, e.g. "2026-04-15" */
  date: string;
  /** Schedule entries for this day */
  items: DayTimeEntry[];
  /** Announcements for this day */
  announcements?: DayAnnouncement[];
  /** Optional note displayed on this day */
  note?: string;
}
