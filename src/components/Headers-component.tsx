import React from "react";
import Clock from "./Clock-component";
import { Button } from "./Button";

const Headers = ({ fetchData }: { fetchData: () => void }) => {
  return (
    <div className="relative w-full h-[120px] sm:h-[180px] lg:h-[300px]">
      <Button
        className="absolute top-2 left-2 sm:left-4 flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm opacity-0 hover:opacity-100 focus:opacity-100 transition-opacity bg-white/20 text-white"
        onClick={fetchData}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
        <span className="hidden sm:inline">רענן</span>
      </Button>
      <div className="text-right p-3 sm:p-5">
        <Clock />
      </div>
    </div>
  );
};

export default Headers;
