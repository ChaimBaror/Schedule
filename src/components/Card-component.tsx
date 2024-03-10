import React from "react";
import { Item } from "./Home-component";

interface Props {
  item: Item;
}

const Card: React.FC<Props> = ({ item }) => {
  return (
    <div className="card px-3 max-w-xl">
      <div
        style={{ backgroundImage: `url(${"/assets/row.png"})` }}
        className="bg-cover bg-center title py-1 px-8 text-5xl font-bold text-center font-serif"
      >
        {item.title}
      </div>
      <div className="text-black py-5 font-bold text-center ">
        {item.times?.map((time: string) => (
          <p key={time} className="text-2xl">
            {time}
          </p>
        ))}
        {item.description && (
          <p className="w-3/4 mx-auto text-bas text-xl">{item.description}</p>
        )}
      </div>
    </div>
  );
};

export default Card;
