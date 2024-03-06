import React from "react";
import Card from "./Card-component";
import { Item } from "./Home-component";

type Props = {
  items: Item[];
};

const Column = (props: Props) => {
  const { items } = props;
  return (
    <div className="grid grid-cols-1 max-w-[300px]">
      {items.map((item, i) => (
        <Card item={item} key={i} />
      ))}
    </div>
  );
};

export default Column;
