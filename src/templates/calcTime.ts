import type { Time } from "@/types/items";
import type { KehilaLocation } from "@/types/kehila";
import { getZmanimForLocation, getCandleLightingForLocation, getDailyLearningDafYomi } from "@/services/hebcal.service";
import { formatTime, generateFiveMinutes } from "@/utils/utils";

export function calcTime(time: Time, location: KehilaLocation): string {
  if (!time.dynamic) return time.val;
  const z = getZmanimForLocation(location);
  const round = time.roundToFiveMinutes || time.rond5minet;
  switch (time.zman) {
    case "shkiah": {
      const t = round ? generateFiveMinutes(z.shkiah(), time.nimus || "0") : formatTime(z.shkiah(), time.nimus || "0");
      return time.val ? `${time.val} : ${t}` : t;
    }
    case "CandleLightingTime": {
      const t = formatTime(getCandleLightingForLocation(location), time.nimus || "0");
      return time.val ? `${time.val} : ${t}` : t;
    }
    case "getDailyLearningDafYomi":
      return getDailyLearningDafYomi();
    default:
      return time.val;
  }
}
