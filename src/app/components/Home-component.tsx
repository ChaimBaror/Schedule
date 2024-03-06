"use client";
import React from "react";
import Column from "./Column-component";
import {
  formatTime as ft,
  getDailyLearningDafYomi,
  getZmanim,
} from "../utils/hebcal";
import Headers from "./Headers-component";
import { LoopTextComponents } from "./Loop-text-component";

export type Item = {
  title: string;
  description?: string;
  times?: string[];
};

const Home: React.FC = () => {
  const items: Item[] = [
    {
      title: "שחרית יום חול",
      times: [" מניין א ___________*06:15 ", "מניין ב ___________*08:10 "],
      description: "*בראש חודש ובתענית ציבור נא לעקוב אחרי המודעות",
    },
    {
      title: "מנחה יום חול",
      times: [`${ft(getZmanim().shkiah(), -15)}`],
      description: "כרבע שעה לפני השקיעה שיעור בין מנחה לערבית בנושאים שונים",
    },
    {
      title: "ערבית יום חול",
      description: "עשרים דקות אחרי השקיעה",
      times: [`${ft(getZmanim().shkiah(), 20)}`],
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
    <div className="w-full h-full">
      <div
        style={{ backgroundImage: `url(${"/assets/dash.png"})` }}
        className="w-full md:h-full bg-cover bg-center text-white"
      >
        <Headers />
        <div className="2xl:px-[150px] mx-auto w-full">
          <div className="flex flex-wrap justify-around gap-x-5 text-center direction-rtl">
            <Column items={items} />
            <Column items={items2} />
            <Column items={items3} />
          </div>
        </div>
        <LoopTextComponents />
      </div>
    </div>
  );
};

export default Home;
