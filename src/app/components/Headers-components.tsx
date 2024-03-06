import React from "react";
import Clock from "./Clock-component";
import { ft, getDailyLearningDafYomi, getZmanim } from "../utils/hebcal";

const Headers = () => {
 const daf =  getDailyLearningDafYomi();
  return (
    <div className="header w-full h-[180px]">
      <div className="text-right left-[50px] p-5">
        <Clock />
        <div className="font-bold text-xl text-gray-700">
          שקיעה היום : {ft(getZmanim().shkiah())}
          <div className="font-bold text-xl text-gray-700">{daf}</div>

        </div>
      </div>
    </div>
  );
};
export default Headers;
