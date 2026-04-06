"use client";
import React, { useEffect, useState } from "react";
import Column from "./ColumnComponent";
import Headers from "../Headers-component";
import { LoopTextComponents } from "../Loop-text-component";
import BackgroundImage from "../Layouts/BackgrongImage";
import { dataFetch, getTimeList } from "@/services/time.service";
import type { Item } from "@/types/items";

const Dashboard: React.FC = () => {
  const [itemsColumnL, setItemsL] = useState<Item[]>(getTimeList().Left);
  const [itemsColumnM, setItemsM] = useState<Item[]>(getTimeList().Medium);
  const [itemsColumnR, setItemsR] = useState<Item[]>(getTimeList().Right);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await dataFetch();
      if (data) {
        setItemsL(data.left ?? getTimeList().Left);
        setItemsM(data.medium ?? getTimeList().Medium);
        setItemsR(data.right ?? getTimeList().Right);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BackgroundImage>
      <Headers fetchData={fetchData} />

      {loading && (
        <div className="flex justify-center py-6">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white opacity-70" />
        </div>
      )}

      {error && (
        <div className="text-center text-white py-4 px-4" dir="rtl">
          <p className="text-sm opacity-80">שגיאה בטעינה — מציג נתוני ברירת מחדל</p>
        </div>
      )}

      <div className="px-3 sm:px-6 md:px-10 lg:px-[150px] mx-auto w-full direction-rtl text-white">
        {/* Mobile: horizontal scroll. Desktop: 3 columns */}
        <div className="flex lg:grid lg:grid-cols-3 overflow-x-auto snap-x snap-mandatory gap-3 pb-4 lg:overflow-visible lg:gap-5 lg:justify-around text-center">
          <Column key="right"  items={itemsColumnR} />
          <Column key="medium" items={itemsColumnM} />
          <Column key="left"   items={itemsColumnL} />
        </div>
      </div>

      <LoopTextComponents />
    </BackgroundImage>
  );
};

export default Dashboard;
