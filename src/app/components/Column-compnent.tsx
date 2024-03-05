import React from "react";
import { Item } from "./Home-compnent";
import Card from "./Card-compoemt";

type Props = {
  items: Item[];
};

const Column = (props: Props) => {
  const { items } = props;
  return (
    <div className="grid grid-cols-1 max-w-[25%]">
      {items.map((item, i) => (
        <Card item={item} key={i} />
      ))}
    </div>
  );
};

export default Column;
