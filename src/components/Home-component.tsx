"use client";
import React from "react";
import Column from "./Column-component";

import {
  formatTime as ft,
  getDailyLearningDafYomi,
  getZmanim,
  generateFiveMinutes as gfm,
} from "../utils/hebcal";
import Headers from "./Headers-component";
import { LoopTextComponents } from "./Loop-text-component";
import BackgrongImage from "./Layouts/BackgrongImage";

export type Item = {
  title: string;
  description?: string;
  times?: string[];
};

const Home: React.FC = () => {
  const geanertItems = () => {
    const d = getZmanim().shkiah();
  };
  const items: Item[] = [
    {
      title: "שחרית יום חול",
      times: [" מניין א ___________*06:15 ", "מניין ב ___________08:10 "],
      description: "*בראש חודש ובתענית ציבור נא לעקוב אחרי המודעות",
    },
    {
      title: "מנחה יום חול",
      times: [`${gfm(getZmanim().shkiah(), -15)}`],
      description: "כרבע שעה לפני השקיעה שיעור בין מנחה לערבית בנושאים שונים",
    },
    {
      title: "ערבית יום חול",
      times: [
        `מניין א ___________  ${gfm(getZmanim().shkiah(), 20)} `,
        "עשרים דקות אחרי השקיעה",
        "מניין נוסף ________22:30 ",
      ],
    },
  ];

  const items2: Item[] = [
    {
      title: "מנחה ערב שבת",
      times: ["עשר דקות לאחר הדלקת נרות"],
      description: `${ft(getZmanim().shkiah(), -20)}: הדלקת נרות `,
    },
    {
      title: "ערבית ליל שבת",
      description: " כחצי שעה לאחר השקיעה",
      times: [`${ft(getZmanim().shkiah(), 30)}`],
    },
    {
      title: "שחרית יום שבת",
      description: "שיעור בגמרא ובהלכה מיד לאחר תפילת שחרית בשבת",
      times: ["08:00"],
    },
  ];

  const items3: Item[] = [
    {
      title: "אבות ובנים ",
      description: "",
      times: ["קיץ : 45 דקות קודם מנחה", 'חורף : אחר תפילת ערבית של מוצש"ק'],
    },
    {
      title: "מנחה שבת",
      description: "עשר דקות קודם הדלקת נרות ",
      times: [`${ft(getZmanim().shkiah(), -30)}`],
    },
    {
      title: `ערבית מוצש"ק `,
      times: ["בחורף: בזמן צאת שבת", "בקיץ:  5 דקות קודם יציאת שבת"],
    },
    {
      title: "שיעור הדף היומי ",
      description: `שיעור א : בשעה 5:40 בבוקר  \n שיעור ב : לאחר שחרית מניין ב`,
      times: [`${getDailyLearningDafYomi()}`],
    },
  ];

  return (
    <BackgrongImage>
      <Headers />
      <div className="px-[150px] mx-auto w-full direction-rtl text-white">
        <div className="flex flex-wrap justify-around gap-x-5 text-center">
          <Column items={items} />
          <Column items={items2} />
          <Column items={items3} />
        </div>
      </div>
      <LoopTextComponents />
    </BackgrongImage>
  );
};

export default Home;
