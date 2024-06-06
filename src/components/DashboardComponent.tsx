"use client";
import React, { useEffect, useState } from "react";
import Column from "./Column-component";
import Headers from "./Headers-component";
import { LoopTextComponents } from "./Loop-text-component";
import BackgrongImage from "./Layouts/BackgrongImage";
import { dataFetch, getTimeList } from "@/services/time.service";

const Dashboard: React.FC = () => {
  const [itemsColumnL, setItemsL] = useState([]);
  const [itemsColumnM, setItemsM] = useState([]);
  const [itemsColumnR, setItemsR] = useState([]);
  const currentDate = new Date();

  // useEffect(() => {
  //   const fetchTimeList = async () => {
  //     try {
  //       const { Right, Medium, Left } = await getTimeList();
  //       setItemsL(Left);
  //       setItemsM(Medium);
  //       setItemsR(Right);
  //     } catch (error) {
  //       console.error("Error fetching time list:", error);
  //     }
  //   };
  //   fetchTimeList();
  // }, [currentDate.getDay()]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { right, medium, left } = await dataFetch();
        setItemsL(left);
        setItemsM(medium);
        setItemsR(right);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData(); // Initial fetch

    // const interval = setInterval(() => {
    //   fetchData();
    // }, 6000);

    // return () => clearInterval(interval);
  }, []);


  return (
    <BackgrongImage>
      <Headers />
      <div className="lg:px-[150px] mx-auto w-full direction-rtl text-white">
        <div className="flex flex-wrap justify-around gap-x-5 text-center">
          <Column items={itemsColumnR} />
          <Column items={itemsColumnM} />
          <Column items={itemsColumnL} />
        </div>
      </div>
      <LoopTextComponents />
    </BackgrongImage>
  );
};

export default Dashboard;
