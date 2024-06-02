import React from "react";
import { formatTime as ft, generateFiveMinutes as gfm } from "@/utils/utils";
import { getDailyLearningDafYomi, getZmanim } from "@/services/hebcal.service";

interface Props {
  item: Item;
}

const Card: React.FC<Props> = ({ item }) => {
  const calculateDynamicTime = (time: Time) => {
    if (time.dynamic) {
      if (time?.zman === "shkiah") {
        const val =  gfm(getZmanim().shkiah(), time?.nimus);
        return time.val ? time.val + " : " + val : val;
      }
      if (time?.zman === "getDailyLearningDafYomi") {
        return getDailyLearningDafYomi();
      }
      // Add more dynamic time calculations if needed
    }
    console.log("time in", time);
    
    return time.val;
  };

  return (
    <div className="card px-3 max-w-xl">
      <div
        style={{ backgroundImage: `url(${"/assets/row.png"})` }}
        className="bg-cover bg-center title py-1 px-8 text-5xl font-bold text-center font-serif"
      >
        {item.title}
      </div>
      <div className="text-black py-5 font-bold text-center">
        {item.times?.map((time) => (
          <p key={time.val} className="text-2xl">
            {calculateDynamicTime(time)}
          </p>
        ))}
        {item.description && (
          <p className="w-3/4 mx-auto text-base text-xl">{item.description}</p>
        )}
      </div>
    </div>
  );
};

export default Card;
