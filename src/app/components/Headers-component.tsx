import React from "react";
import Clock from "./Clock-component";
import { getDailyLearningDafYomi, getEvents, getZmanim } from "../utils/hebcal";

const Headers = () => {
 const daf =  getDailyLearningDafYomi();
 const events = getEvents();

 
  return (
    <div className="header w-full h-[300px] sm:h-[175px]">
      <div className="text-right left-[50px] p-5">
        <Clock />
        <div className="font-bold text-xl text-gray-700">
          {/* שקיעה היום : {ft(getZmanim().shkiah())} */}
          {/* <div className="font-bold text-xl text-gray-700">{daf}</div> */}


        </div>
      </div>
    </div>
  );
};
export default Headers;
