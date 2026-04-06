import React, { useEffect, useMemo, useState } from "react";
import { formatTime as ft, generateFiveMinutes as gfm } from "@/utils/utils";
import {
  getCandleLightingTime,
  getDailyLearningDafYomi,
  getZmanim,
} from "@/services/hebcal.service";
import type { Item, Time } from "@/types/items";

interface Props {
  item: Item;
  onEdit: () => void;
}

function calculateDynamicTime(time: Time): string {
  if (!time.dynamic) return time.val;
  const round = time.roundToFiveMinutes || time.rond5minet;
  switch (time.zman) {
    case "shkiah": {
      const t = round
        ? gfm(getZmanim().shkiah(), time.nimus || "0")
        : ft(getZmanim().shkiah(), time.nimus || "0");
      return time.val ? `${time.val} : ${t}` : t;
    }
    case "getDailyLearningDafYomi":
      return getDailyLearningDafYomi();
    case "CandleLightingTime": {
      const t = ft(getCandleLightingTime(), time.nimus || "0");
      return time.val ? `${time.val} : ${t}` : t;
    }
    default:
      return time.val;
  }
}

const Card: React.FC<Props> = ({ item, onEdit }) => {
  const [formData, setFormData] = useState<Item>(item);
  useEffect(() => { setFormData(item); }, [item]);

  const computedTimes = useMemo(
    () => formData.times.map((t) => ({ ...t, computed: calculateDynamicTime(t) })),
    [formData]
  );

  return (
    <div className="relative card px-2 sm:px-3 max-w-full text-lg sm:text-xl lg:text-2xl group">
      <div
        className="bg-cover bg-center py-1 px-2 text-xl sm:text-3xl lg:text-5xl font-bold text-center font-serif"
        style={{ backgroundImage: `url("/assets/row.png")` }}
      >
        {formData.title}
      </div>
      <div className="text-black py-3 sm:py-5 font-bold text-center px-4 sm:px-8">
        {computedTimes.map((time, index) => (
          <div key={index} className="flex items-center justify-center w-full mb-2">
            {time.name && (
              <>
                <span className="whitespace-nowrap text-sm sm:text-base">{time.name}</span>
                <span className="flex-grow border-t border-black mx-2" />
              </>
            )}
            <span className="whitespace-nowrap">{time.computed}</span>
          </div>
        ))}
        {formData.description && (
          <p className="w-3/4 mx-auto text-sm sm:text-base mt-2 font-normal">
            {formData.description}
          </p>
        )}
      </div>

      {/* Always visible on mobile, hover on desktop */}
      <button
        aria-label="ערוך כרטיס"
        className="px-2 py-1 rounded absolute top-2 right-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity active:scale-95 bg-white/70"
        onClick={onEdit}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
        </svg>
      </button>
    </div>
  );
};

export default Card;
