import React from "react";
import Card from "./Card-component";
import { Item } from "./Home-component";

interface ColumnProps {
  items: Item[];
}

const Column: React.FC<ColumnProps> = ({ items }) => {
  return (
    <div className="grid grid-cols-1 max-w-[300px]">
      {items.map((item, index) => (
        <Card item={item} key={index} />
      ))}
    </div>
  );
};

export default Column;
