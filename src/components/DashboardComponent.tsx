"use client";
import React, { useEffect, useState } from "react";
import Column from "./Column-component";
import Headers from "./Headers-component";
import { LoopTextComponents } from "./Loop-text-component";
import BackgroundImage from "./Layouts/BackgrongImage";
import { dataFetch, getTimeList } from "@/services/time.service";

const Dashboard: React.FC = () => {
  const [itemsColumnL, setItemsL] = useState<Item[]>(getTimeList().Left);
  const [itemsColumnM, setItemsM] = useState<Item[]>(getTimeList().Medium);
  const [itemsColumnR, setItemsR] = useState<Item[]>(getTimeList().Right);
  const currentDate = new Date();
  useEffect(() => {
    fetchData(); // Initial fetch
  }, [currentDate.getDay()]);

  const fetchData = async () => {
    try {
      const { right, medium, left } = await dataFetch();
      setItemsL(left);
      setItemsM(medium);
      setItemsR(right);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <BackgroundImage>
      <Headers key="header" fetchData={fetchData}  />
      <div className="lg:px-[150px] mx-auto w-full direction-rtl text-white">
        <div className="flex flex-wrap justify-around gap-x-5 text-center">
          <Column key="1" items={itemsColumnR} />
          <Column key="2" items={itemsColumnM} />
          <Column key="3" items={itemsColumnL} />
        </div>
      </div>
      <LoopTextComponents />
    </BackgroundImage>
  );
};

export default Dashboard;
