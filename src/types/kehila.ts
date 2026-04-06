export type TemplateId = "classic" | "modern" | "led" | "mobile" | "sephardic" | "parchment" | "night" | "golden";

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

export interface KehilaState {
  kehila: Kehila;
  announcements: Announcement[];
}
