"use client";
import React, { useEffect, useState } from "react";
import Column from "./Column-component";
import Headers from "./Headers-component";
import { LoopTextComponents } from "./Loop-text-component";
import BackgrongImage from "./Layouts/BackgrongImage";
import { getTimeList } from "@/services/time.service";

const Home: React.FC = () => {
  const [itemsColumn, setItems] = useState([]);
  const [itemsColumn2, setItems2] = useState([]);
  const [itemsColumn3, setItems3] = useState([]);

  useEffect(() => {
    const fetchTimeList = async () => {
      try {
        const { items: fetchedItems, items2: fetchedItems2, items3: fetchedItems3 } = await getTimeList();
        setItems(fetchedItems);
        setItems2(fetchedItems2);
        setItems3(fetchedItems3);
      } catch (error) {
        console.error("Error fetching time list:", error);
      }
    };
    fetchTimeList();
  }, []);

  return (
    <BackgrongImage>
      <Headers />
      <div className="lg:px-[150px] mx-auto w-full h-full direction-rtl text-white">
        <div className="flex flex-wrap justify-around gap-x-5 text-center">
          <Column items={itemsColumn} />
          <Column items={itemsColumn2} />
          <Column items={itemsColumn3} />
        </div>
      </div>
      <LoopTextComponents />
    </BackgrongImage>
  );
};

export default Home;
