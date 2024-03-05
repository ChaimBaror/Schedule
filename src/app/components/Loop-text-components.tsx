"use client";
import React, { useEffect, useState } from "react";
import { getEvents } from "../utils/hebcal";
import { HDate } from "@hebcal/core";

export const LoopTextComponents = () => {
  const [dataZmaniem, setDataZmaniem] = useState("");
  const [events, setEvents] = useState([]);

  const d = new Date();

  useEffect(() => {
    setWeek();
  }, []);

  const setWeek = () => {
    let day = d.getDay()
    setZmainem();

    for (let index = day; index <= 7; index++) {
        console.log('day' , day);
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
        setDataZmaniem((pro) => pro + " &bull; " + ev.render("he"));
      }
    }
  };

  const text = "this is test looop i need this for my defult project";
  return (
    <div className="bg-[#AE8D3E] w-full bottom-5 absolute text-red text-3xl text-bold text-black truncate	">
      <p className=" py-5" dangerouslySetInnerHTML={{ __html: dataZmaniem }} />
    </div>
  );
};
