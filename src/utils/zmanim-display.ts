import {
  getZmanimForLocation,
  getCandleLightingForLocation,
  getTodayHebrewLabel,
  getParashaLabel,
} from "@/services/hebcal.service";
import { formatTime } from "@/utils/utils";
import type { KehilaLocation } from "@/types/kehila";
import type { ZmanimDisplay } from "@/templates/types";

export function buildZmanimDisplay(location: KehilaLocation): ZmanimDisplay {
  const z = getZmanimForLocation(location);
  const cl = getCandleLightingForLocation(location);

  // shabbat end = candleLighting + 80 min (approx tzet kochavim on motzash)
  const shabbatEndDate = new Date(cl);
  shabbatEndDate.setMinutes(shabbatEndDate.getMinutes() + 80);

  return {
    shkiah: formatTime(z.shkiah()),
    sunrise: formatTime(z.sunrise()),
    chatzot: formatTime(z.chatzot()),
    candleLighting: formatTime(cl),
    shabbatEnd: formatTime(shabbatEndDate),
    sofZmanShma: formatTime(z.sofZmanShma()),
    minchaGedola: formatTime(z.minchaGedola()),
    hebrewDate: getTodayHebrewLabel(),
    parasha: getParashaLabel(),
  };
}
