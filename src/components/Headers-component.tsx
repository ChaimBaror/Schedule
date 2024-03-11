import React from "react";
import Clock from "./Clock-component";
import { getDailyLearningDafYomi, getEvents, getZmanim } from "../services/hebcal.service";
import Image from "next/image";

const Headers = () => {
 const daf =  getDailyLearningDafYomi();
 const events = getEvents();

 
  return (
    <div className="header w-full h-[300px] ">
      <div className="text-right left-[50px] p-5">
        <Clock />
        <div className="font-bold text-xl text-gray-700">
          {/* שקיעה היום : {ft(getZmanim().shkiah())} */}
          {/* <div className="font-bold text-xl text-gray-700">{daf}</div> */}


        </div>
      </div>
      {/* <div className="logo">
      <Image
            src={"/assets/logo.png"}
            alt="logo"
            width={200}
            height={200}
          />
      </div> */}
    </div>
  );
};
export default Headers;
