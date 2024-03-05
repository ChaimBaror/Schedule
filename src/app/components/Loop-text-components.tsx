"use client";
import React, { useEffect, useState } from "react";
import { getEvents } from "../utils/hebcal";

export const LoopTextComponents = () => {
  const [dataZmaniem, setDataZmaniem] = useState(" &bull; ");

  const d = new Date();

  useEffect(() => {
    setWeek();
  }, []);

  const setWeek = () => {
    setDataZmaniem('')
    let day = d.getDay()
    setZmainem();

    for (let index = day; index <= 7; index++) {
      console.log('day', d.toLocaleDateString());
      d.setDate(d.getDate() + 1); // Move to the next day
      day = d.getDay(); // Update the day variable to reflect the new day of the week

      setZmainem();
    }

  }

  const setZmainem = () => {
    const events = getEvents();
    for (const ev of events) {
      const hd = ev.getDate();
      const date = hd.greg();

      if (date.toLocaleDateString() === d.toLocaleDateString()) {
        setDataZmaniem((pro) => pro + ev.render("he") + " &bull; ");
      }
    }
  };

  return (
    <div className=" w-full inline-flex flex-nowrap bg-[#AE8D3E] bottom-5 absolute text-3xl text-bold text-black truncate py-3	">
      <div className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-infinite-scroll"
        dangerouslySetInnerHTML={{ __html: dataZmaniem }}
      />

      <div className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-infinite-scroll"
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: dataZmaniem }}
      />
      <div className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-infinite-scroll"
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: dataZmaniem }}
      />
      <div className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-infinite-scroll"
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: dataZmaniem }}
      />
      <div className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-infinite-scroll"
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: dataZmaniem }}
      />
    </div>
  );
};
