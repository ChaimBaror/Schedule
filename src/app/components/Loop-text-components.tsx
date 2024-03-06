"use client";
import React, { useEffect, useState } from "react";
import { candleLight, ft, getEvents, getZmanim } from "../utils/hebcal";

export const LoopTextComponents = () => {
  const [dataZmaniem, setDataZmaniem] = useState("");

  const d = new Date();
  useEffect(() => {
    addEvents();
    addZmanim();
    addToList("הדלקת נרות : " + ft(candleLight()))
  }, []);

  const addZmanim = () => {
    const z = getZmanim()
    addToList(" חצות : " + ft(z.chatzot()))
    addToList(" זריחה : " + ft(z.sunrise()))
    addToList(" שקיעה : " + ft(z.shkiah()))
    addToList(" סוף זמן ק''ש : " + ft(z.sofZmanShma()))
    addToList(" מנחה גדולה : " + ft(z.minchaGedola()))
  }


  const addEvents = () => {
    const events = getEvents();
    for (const ev of events) {
      const hd = ev.getDate();
      const date = hd.greg();

      if (date.toLocaleDateString() === d.toLocaleDateString()) {
        addToList(ev.render("he"))
      }
    }
  };

  const addToList = (event: string) => {
    setDataZmaniem((pro) => pro + event + " &bull; ");
  }

  return (
    <div className=" w-full inline-flex flex-nowrap bg-[#AE8D3E] bottom-5 absolute text-3xl text-bold text-black truncate py-3	">
      <div className="flex items-center justify-center animate-infinite-scroll"
        dangerouslySetInnerHTML={{ __html: dataZmaniem }}
      />

      <div className="flex items-center justify-center animate-infinite-scroll"
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: dataZmaniem }}
      />
      <div className="flex items-center justify-center animate-infinite-scroll"
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: dataZmaniem }}
      />
    </div>
  );
};


