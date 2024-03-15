"use client";
import React, { useEffect, useState } from "react";
import Column from "./Column-component";
import Headers from "./Headers-component";
import { LoopTextComponents } from "./Loop-text-component";
import BackgrongImage from "./Layouts/BackgrongImage";
import { getTimeList } from "@/services/time.service";

const Home: React.FC = () => {
  const [itemsColumnL, setItemsL] = useState([]);
  const [itemsColumnM, setItemsM] = useState([]);
  const [itemsColumnR, setItemsR] = useState([]);
  const currentDate = new Date();
  useEffect(() => {
    const fetchTimeList = async () => {
      try {
        const { ColumnL, ColumnM, ColumnR } = await getTimeList();
        setItemsL(ColumnL);
        setItemsM(ColumnM);
        setItemsR(ColumnR);
      } catch (error) {
        console.error("Error fetching time list:", error);
      }
    };
    fetchTimeList();
  }, [currentDate.getDay()]);

  return (
    <BackgrongImage>
      <Headers />
      <div className="lg:px-[150px] mx-auto w-full direction-rtl text-white">
        <div className="flex flex-wrap justify-around gap-x-5 text-center">
          <Column items={itemsColumnL} />
          <Column items={itemsColumnM} />
          <Column items={itemsColumnR} />
        </div>
      </div>
      <LoopTextComponents />
    </BackgrongImage>
  );
};

export default Home;
