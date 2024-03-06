"use client";
import React, { useEffect, useState } from "react";
import { formatTime, getEvents, getZmanim } from "../utils/hebcal";

export const LoopTextComponents = () => {
  const [zmanimData, setZmanimData] = useState<string>('');
  const currentDate = new Date();


  useEffect(() => {
    addZmanimAndEventsToList();
  }, [currentDate.getDay()]);

  const addZmanimAndEventsToList = () => {
    const currentDate = new Date();
    const zmanim = getZmanim();
    const zmanimEntries = [
      { label: "חצות", time: zmanim.chatzot() },
      { label: "זריחה", time: zmanim.sunrise() },
      { label: "שקיעה", time: zmanim.shkiah() },
      { label: "סוף זמן ק''ש", time: zmanim.sofZmanShma() },
      { label: "מנחה גדולה", time: zmanim.minchaGedola() },
    ];
    const formattedZmanim = zmanimEntries.map(
      (entry) => `${entry.label}: ${formatTime(entry.time)}`
    );

    const todayEvents = getEvents().filter(
      (ev) =>
        ev.getDate().greg().toLocaleDateString() ===
        currentDate.toLocaleDateString()
    );
    const formattedEvents = todayEvents.map((ev) => ev.render("he"));

    setZmanimData(
      (pro) => pro + [...formattedZmanim, ...formattedEvents].join("  &bull; ") + " &bull; "
    );
  };

  return (
    <div className=" w-full inline-flex flex-nowrap bg-[#AE8D3E] bottom-5 absolute text-3xl text-bold text-black truncate py-3	">
      <div
        className="flex items-center justify-center animate-infinite-scroll"
        dangerouslySetInnerHTML={{ __html: zmanimData }}
      />

      <div
        className="flex items-center justify-center animate-infinite-scroll"
        aria-hidden="true"
        dangerouslySetInnerHTML={{
          __html: zmanimData,
        }}
      />
      <div
        className="flex items-center justify-center animate-infinite-scroll"
        aria-hidden="true"
        dangerouslySetInnerHTML={{
          __html: zmanimData,
        }}
      />
    </div>
  );
};
