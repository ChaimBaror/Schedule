import React from "react";
import Clock from "./Clock-component";
import { Button } from "./Button";

const Headers = ({ fetchData }: { fetchData: () => void }) => {
  return (
    <div className="header w-full h-[300px] ">
      <Button
        className="w-[150px] text-left left-[50px] p-5 px-4 py-2 rounded absolute top-2 right-2 opacity-0 hover:opacity-100 transition-opacity"
        onClick={fetchData}
      >
        Fetch Data
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
</svg>

      </Button>
      <div className="text-right left-[50px] p-5">
        <Clock />
        <div className="font-bold text-xl text-gray-700"></div>
      </div>
    </div>
  );
};
export default Headers;
