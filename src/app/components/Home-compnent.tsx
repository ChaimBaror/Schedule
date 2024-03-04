import React from "react";
import CardList from "./Card-compoemt";
import { LoopTextComponents } from "./Loop-text-components";

export type Item = {
  title: string;
  description?: string;
  times?: any;
};

const Home = () => {
  const items: Item[] = [
    {
      title: "שחרית יום חול",
      times: {
        "מניין א": "6:15",
        "מניין ב": "08:10",
      },
    },
    {
      title: "מנחה יום חול",
      description: "כרבע שעה לפני השקיעה שיעור בין מנחה לערבית בנושאים שונים",
    },
    {
      title: "ערבית יום חול",
      description: "עשרית דקות אחרי השקיעה",
      times: {},
    },
  ];

  const items2: Item[] = [
    {
      title: "מנחה ערב שבת",
      description: "10 דקות לאחר הדלקת נרות ",
      times: {},
    },
    {
      title: "ערבית ליל שבת",
      description: "עשרית דקות אחרי השקיעה",
      times: {},
    },
    {
      title: "שחרית יום שבת",
      description: "שיעור בגמרא ובהלכה מיד לאחר תפילת שחרית בשבת",
      times: {
        " ב": "08:00",
      },
    },
  ];

  const items3: Item[] = [
    {
      title: "אבות ובנים ",
      description: "  ",
      times: {
        קיץ: " דקות קודם מנחה",
        חורף: `אחר תפילת ערבית של מוצש"ק`,
      },
    },
    {
      title: "מנחה שבת",
      description: "10 דקות קודם הדלקת נרות      ",
      times: {},
    },
    {
      title: `ערבית מוצש"ק `,
      times: {
        " בחורף": `בזמן צאת שבת`,
        "בקיץ": ` 5 דקות קודם יציאת שבת`,
      },
    },
    {
      title: "שיעור הדף היומי ",
      times: {
        "שיעור א": ` בשעה 5:40 בבוקר`,
        "שיעור ב": `לאחר שחרית מניין ב `,
      },
    },
  ];

  return (
    <div className="w-full h-full">
      <div
        style={{ backgroundImage: `url(${"/assets/dash.png"})` }}
        className="w-full h-full bg-cover bg-center text-white"
      >
        <div>
          <div className="">time for shbat</div>
          <div className="px-[200px] mt-[350px] mx-auto w-full">
            {/* <div className="grid grid-rows-4 grid-flow-col gap-4 text-center"> */}
            <div className="flex flex-wrap justify-around gap-x-10 text-center">
              <CardList items={items3} />
              <CardList items={items2} />
              <CardList items={items} />
            </div>
          </div>
        </div>
        <LoopTextComponents />
      </div>
    </div>
  );
};

export default Home;
