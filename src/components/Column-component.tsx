import React, { Suspense } from "react";
import Card from "./Card-component";
import { Item } from "@/types/items";

interface ColumnProps {
  items: Item[];
}

const Column: React.FC<ColumnProps> = ({ items }) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
    <div className="grid grid-cols-1 max-w-[400px]">
      {items?.map((item, index) => (
        <Card item={item} key={index} />
      ))}
    </div>
    </Suspense>
  );
};

export default Column;
