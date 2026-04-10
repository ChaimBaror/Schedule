import type { Item } from '@/types/items';
import type { Block } from '@/types/block';
import type { Kehila, Announcement, DisplaySettings } from '@/types/kehila';

export interface ZmanimDisplay {
  shkiah: string;
  sunrise: string;
  chatzot: string;
  candleLighting: string;
  shabbatEnd: string;
  sofZmanShma: string;
  minchaGedola: string;
  hebrewDate: string;
  parasha: string;
}

export interface TemplateProps {
  kehila: Kehila;
  itemsRight: Item[];
  itemsMiddle: Item[];
  itemsLeft: Item[];
  announcements: Announcement[];
  zmanim: ZmanimDisplay;
  isKiosk?: boolean;
  onEdit?: (item: Item) => void;
  /** Dynamic blocks (new system) — when provided, templates render these instead of items */
  blocks?: Block[];
  /** Display settings (scroll, ticker, paging) */
  displaySettings?: DisplaySettings;
}
