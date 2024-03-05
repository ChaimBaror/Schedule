"use client";
import React, { useEffect } from "react";
import { LoopTextComponents } from "./Loop-text-components";
import Column from "./Column-compnent";
import { ft, getEvents, getZmanim } from "../utils/hebcal";
import Clock from "./Clock-component";

export type Item = {
  title: string;
  description?: string;
  times?: any;
};

const Home = () => {

 
  const items: Item[] = [
    {
      title: "שחרית יום חול",
      times: [' מניין א _______________06:15 ',
       "מניין ב _______________08:10 "
      ]
    },
    {
      title: "מנחה יום חול",
      description: "כרבע שעה לפני השקיעה שיעור בין מנחה לערבית בנושאים שונים",
    },
    {
      title: "ערבית יום חול",
      description: "עשרים דקות אחרי השקיעה",
      times: [`${ft(getZmanim().shkiah(), 20) }`],
    },
  ];

  const items2: Item[] = [
    {
      title: "מנחה ערב שבת",
      description: "10 דקות לאחר הדלקת נרות ",
      times: [],
    },
    {
      title: "ערבית ליל שבת",
      description: " כחצי שעה לאחר השקיעה",
      times: [`${ft(getZmanim().shkiah(), 30) }`],
    },
    {
      title: "שחרית יום שבת",
      description: "שיעור בגמרא ובהלכה מיד לאחר תפילת שחרית בשבת",
      times: ["08:00",],
    },
  ];

  const items3: Item[] = [
    {
      title: "אבות ובנים ",
      description: "",
      times: [` קיץ : דקות קודם מנחה`, ' חורף : אחר תפילת ערבית של מוצש"ק']
    },
    {
      title: "מנחה שבת",
      description: "10 דקות קודם הדלקת נרות      ",
      times: [`${ft(getZmanim().shkiah(), -30) }`],
    },
    {
      title: `ערבית מוצש"ק `,
      times: ['בחורף: בזמן צאת שבת', 'בקיץ:  5 דקות קודם יציאת שבת']
    },
    {
      title: "שיעור הדף היומי ",
      times: ['שיעור א : בשעה 5:40 בבוקר',
        'שיעור ב : לאחר שחרית מניין ב',
      ]

    },
  ];

  return (
    <div className="w-full h-full">
      <div
        style={{ backgroundImage: `url(${"/assets/dash.png"})` }}
        className="w-full h-full bg-cover bg-center text-white"
      >
        <div>
          <div className="pb-8 text-right left-[50px] p-[50px]">
            <Clock />
            <div className="font-bold text-xl text-gray-700" >שקיעה היום : {ft(getZmanim().shkiah())}</div>
          </div>
          <div className="px-[200px] mx-auto w-full">
            <div className="flex flex-wrap justify-around gap-x-10 text-center">
              <Column items={items3} />
              <Column items={items2} />
              <Column items={items} />
            </div>
          </div>
        </div>
        <LoopTextComponents />
      </div>
    </div>
  );
};

export default Home;
