"use client";
import React, { useEffect, useState } from "react";
import { getEventsForLocation, getZmanimForLocation } from "../services/hebcal.service";
import { DEFAULT_LOCATION } from "../services/hebcal.service";
import { formatTime } from "@/utils/utils";

export const LoopTextComponents = () => {
  const [ticker, setTicker] = useState<string>('');

  useEffect(() => {
    buildTicker();
  }, []);

  const buildTicker = () => {
    const currentDate = new Date();
    const zmanim = getZmanimForLocation(DEFAULT_LOCATION);
    const zmanimEntries = [
      { label: "זריחה", time: zmanim.sunrise() },
      { label: "סוף זמן ק''ש", time: zmanim.sofZmanShma() },
      { label: "חצות", time: zmanim.chatzot() },
      { label: "מנחה גדולה", time: zmanim.minchaGedola() },
      { label: "שקיעה", time: zmanim.shkiah() },
    ];
    const zmanimStr = zmanimEntries.map((e) => `${e.label}: ${formatTime(e.time)}`).join("  🔹  ");

    const todayEvents = getEventsForLocation(DEFAULT_LOCATION).filter(
      (ev) => ev.getDate().greg().toLocaleDateString() === currentDate.toLocaleDateString()
    );
    const eventsStr = todayEvents.map((ev) => ev.render("he")).join("  🔹  ");

    setTicker([zmanimStr, eventsStr].filter(Boolean).join("  🔹  ") + "  🔹  ");
  };

  if (!ticker) return null;

  return (
    <div className="direction-rtl w-full overflow-hidden bg-[#AE8D3E] bottom-0 fixed z-20 text-base sm:text-lg lg:text-xl font-bold text-black py-2">
      <div className="flex whitespace-nowrap">
        <span className="animate-ticker inline-block px-4">{ticker}</span>
        <span className="animate-ticker inline-block px-4" aria-hidden>{ticker}</span>
        <span className="animate-ticker inline-block px-4" aria-hidden>{ticker}</span>
      </div>
    </div>
  );
};
