import React from "react";
import Clock from "./Clock-component";
import { getDailyLearningDafYomi, getEvents, getZmanim } from "../services/hebcal.service";
import Image from "next/image";

const Headers = () => {
 const daf =  getDailyLearningDafYomi();

 
  return (
    <div className="header w-full h-[300px] ">
      <div className="text-right left-[50px] p-5">
        <Clock />
        <div className="font-bold text-xl text-gray-700">
          {/* <div className="font-bold text-xl text-gray-700">{daf}</div> */}
        </div>
      </div>
    </div>
  );
};
export default Headers;
