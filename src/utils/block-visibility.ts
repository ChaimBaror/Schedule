import type { Block, VisibilityRule } from "@/types/block";

/** Check if a block should be visible right now */
export function isBlockVisible(block: Block, now = new Date(), candleLightingTime?: Date): boolean {
  return matchesVisibility(block.visibility, now, candleLightingTime);
}

function matchesVisibility(v: VisibilityRule, now: Date, candleLightingTime?: Date): boolean {
  switch (v.rule) {
    case "always":
      return true;

    case "days":
      return v.days?.includes(now.getDay()) ?? true;

    case "date-range": {
      const today = now.toISOString().slice(0, 10);
      if (v.fromDate && today < v.fromDate) return false;
      if (v.toDate && today > v.toDate) return false;
      return true;
    }

    case "before-shabbat": {
      if (!candleLightingTime || !v.hoursBeforeShabbat) return false;
      const msBeforeShabbat = candleLightingTime.getTime() - now.getTime();
      return msBeforeShabbat > 0 && msBeforeShabbat <= v.hoursBeforeShabbat * 60 * 60 * 1000;
    }

    default:
      return true;
  }
}

/** Filter blocks to only visible ones */
export function getVisibleBlocks(blocks: Block[], now = new Date(), candleLightingTime?: Date): Block[] {
  return blocks.filter((b) => isBlockVisible(b, now, candleLightingTime));
}
