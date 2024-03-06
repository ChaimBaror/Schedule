"use client";
import React from "react";
import Column from "./Column-component";
import { formatTime as ft, getDailyLearningDafYomi, getZmanim } from "../utils/hebcal";
import Headers from "./Headers-component";
import { LoopTextComponents } from "./Loop-text-component";

export type Item = {
  title: string;
  description?: string;
  times?: string[];
};

const Home: React.FC = () => {
  const generateTimes = (title: string, description: string, offset: number): string[] => {
    const shkiah = getZmanim().shkiah();
    return [`${ft(shkiah, offset)}`, description];
  };

  const items: Item[] = [
    {
      title: "שחרית יום חול",
      times: [" מניין א ___________*06:15 ", "מניין ב ___________*08:10 "],
      description: "*בראש חודש ובתענית ציבור נא לעקוב אחרי המודעות",
    },
    {
      title: "מנחה יום חול",
      times: generateTimes("מנחה יום חול", "כרבע שעה לפני השקיעה שיעור בין מנחה לערבית בנושאים שונים", -15),
    },
    {
      title: "ערבית יום חול",
      times: generateTimes("ערבית יום חול", "עשרים דקות אחרי השקיעה", 20),
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
      times: generateTimes("ערבית ליל שבת", "", 30),
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
      times: generateTimes("מנחה שבת", "", -30),
    },
    {
      title: `ערבית מוצש"ק `,
      description: `בחורף: בזמן צאת שבת "בקיץ:  5 דקות קודם יציאת שבת`,
    },
    {
      title: "שיעור הדף היומי ",
      description: `שיעור א : בשעה 5:40 בבוקר    \n שיעור ב : לאחר שחרית מניין ב`,
      times: [`${getDailyLearningDafYomi()}`],
    },
  ];

  return (
    <div className="w-full h-full">
      <div
        style={{ backgroundImage: `url(${"/assets/dash.png"})` }}
        className="w-full h-full bg-cover bg-center text-white"
      >
        <Headers />
        <div className="px-[200px] mx-auto w-full">
          <div className="flex flex-wrap justify-around gap-x-10 text-center">
            <Column items={items3} />
            <Column items={items2} />
            <Column items={items} />
          </div>
        </div>
        <LoopTextComponents />
      </div>
    </div>
  );
};

export default Home;
