export type TemplateId = "classic" | "modern" | "led" | "mobile" | "sephardic" | "parchment" | "night" | "golden" | "royal-blue" | "marble" | "wood";

export interface KehilaLocation {
  lat: number;
  lng: number;
  tzid: string;
  cityName: string;
}

export interface Kehila {
  slug: string;
  name: string;
  city: string;
  location: KehilaLocation;
  templateId: TemplateId;
  primaryColor: string;
  logoUrl?: string;
  phone?: string;
  rabbi?: string;
}

export type AnnouncementType = "simcha" | "avel" | "notice";

export interface Announcement {
  id: string;
  type: AnnouncementType;
  text: string;
  expiresAt?: string; // ISO date string
  priority: number;
}

export interface ImageAnnouncement {
  id: string;
  /** base64 data URL of the uploaded image */
  imageData: string;
  /** Display width in pixels */
  displayWidth: number;
  /** Optional label */
  label?: string;
  expiresAt?: string; // ISO date string
}

// ─── Display settings ────────────────────────────────────────────────────────

export type TickerSpeed = "slow" | "normal" | "fast";
export type ScrollMode = "bounce" | "down" | "none";
export type DesktopLayout = "columns" | "auto-page";
export type ColumnCount = 2 | 3;

export interface DisplaySettings {
  /** Ticker speed */
  tickerSpeed: TickerSpeed;
  /** Pause ticker on hover */
  tickerPauseOnHover: boolean;
  /** Auto-scroll mode when columns overflow */
  columnScrollMode: ScrollMode;
  /** Column scroll speed (px/sec) */
  columnScrollSpeed: number;
  /** Pause at top/bottom (ms) */
  columnPauseAtEdge: number;
  /** Mobile auto-page interval (ms), 0 = manual */
  mobilePageInterval: number;
  /** Mobile page transition duration (ms) */
  mobileTransitionDuration: number;
  /** Desktop layout: side-by-side columns or auto-page */
  desktopLayout: DesktopLayout;
  /** Desktop auto-page interval (ms) — used when desktopLayout is "auto-page" */
  desktopPageInterval: number;
  /** Number of columns */
  columnCount: ColumnCount;
}

export const DEFAULT_DISPLAY_SETTINGS: DisplaySettings = {
  tickerSpeed: "normal",
  tickerPauseOnHover: true,
  columnScrollMode: "bounce",
  columnScrollSpeed: 25,
  columnPauseAtEdge: 4000,
  mobilePageInterval: 8000,
  mobileTransitionDuration: 500,
  desktopLayout: "columns",
  desktopPageInterval: 10000,
  columnCount: 3,
};

export interface KehilaState {
  kehila: Kehila;
  announcements: Announcement[];
  imageAnnouncements: ImageAnnouncement[];
  displaySettings: DisplaySettings;
}
