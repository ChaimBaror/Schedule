import React, { useEffect, useState } from "react";
import { formatTime as ft, generateFiveMinutes as gfm } from "@/utils/utils";
import {
  getCandleLightingTime,
  getDailyLearningDafYomi,
  getZmanim,
} from "@/services/hebcal.service";

interface Props {
  item: Item;
  onEdit: () => void;
}

const Card: React.FC<Props> = ({ item, onEdit }) => {
  const [formData, setFormData] = useState<Item>(item);

  useEffect(() => {
    setFormData(item);
  }, [item]);

  const calculateDynamicTime = (time: Time) => {
    if (time.dynamic) {
      let calculatedTime: string | undefined = "";
      switch (time.zman) {
        case "shkiah":
          calculatedTime = time.rond5minet
            ? gfm(getZmanim().shkiah(), time.nimus || "0")
            : ft(getZmanim().shkiah(), time.nimus || "0");
          break;
        case "getDailyLearningDafYomi":
          calculatedTime = getDailyLearningDafYomi();
          break;
        case "CandleLightingTime":
          calculatedTime = ft(getCandleLightingTime(), time.nimus || "0");
          break;
        default:
          calculatedTime = time.val;
      }
      return time.val ? `${time.val} : ${calculatedTime}` : calculatedTime;
    }
    return time.val;
  };


  return (
    <div className="relative card px-3 max-w-xl text-2xl group">
      <div
        className="bg-cover bg-center py-1 px-2 text-5xl font-bold text-center font-serif"
        style={{ backgroundImage: `url("/assets/row.png")` }}
      >
        {formData.title}
      </div>
      <div className="text-black py-5 font-bold text-center px-8">
        {formData.times?.map((time, index) => (
          <div
            key={index}
            className="flex items-center justify-center w-full mb-2"
          >
            {time.name && (
              <>
                <span className="whitespace-nowrap">{time.name}</span>
                <span className="flex-grow border-t border-black mx-2"></span>
              </>
            )}
            <span className="whitespace-nowrap">
              {calculateDynamicTime(time)}
            </span>
          </div>
        ))}
        {formData.description && (
          <p className="w-3/4 mx-auto text-base text-xl">
            {formData.description}
          </p>
        )}
      </div>
      <button
        className=" px-4 py-2 rounded absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={onEdit}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
          />
        </svg>
      </button>
    </div>
  );
};

export default Card;
