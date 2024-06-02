import React from "react";
import { formatTime as ft, generateFiveMinutes as gfm } from "@/utils/utils";
import { getDailyLearningDafYomi, getZmanim } from "@/services/hebcal.service";


interface Props {
  item: Item;
}

const Card: React.FC<Props> = ({ item }) => {
  const calculateDynamicTime = (time: Time) => {
    if (time.dynamic) {
      let calculatedTime = "";
      switch (time.zman) {
        case "shkiah":
          calculatedTime = gfm(getZmanim().shkiah(), time.nimus ?? 0);
          break;
        case "getDailyLearningDafYomi":
          calculatedTime = getDailyLearningDafYomi();
          break;
        default:
          calculatedTime = time.val;
      }
      return time.val ? `${time.val} : ${calculatedTime}` : calculatedTime;
    }
    return time.val;
  };

  return (
    <div className="card px-3 max-w-xl text-2xl">
      <div
        className="bg-cover bg-center py-1 px-8 text-5xl font-bold text-center font-serif"
        style={{ backgroundImage: `url("/assets/row.png")` }}
      >
        {item.title}
      </div>
      <div className="text-black py-5 font-bold text-center px-8">
        {item.times?.map((time, index) => (
          <div key={index} className="flex items-center justify-center w-full mb-2">
            {time.name && (
              <>
                <span className="whitespace-nowrap">{time.name}</span>
                <span className="flex-grow border-t border-black mx-2"></span>
              </>
            )}
            <span className="whitespace-nowrap">{calculateDynamicTime(time)}</span>
          </div>
        ))}
        {item.description && (
          <p className="w-3/4 mx-auto text-base text-xl">{item.description}</p>
        )}
      </div>
    </div>
  );
};

export default Card;
