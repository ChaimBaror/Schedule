import React from "react";
import { Item } from "./Home-compnent";

type Props = {
  item: Item;
};

const Card = (props: Props) => {
  const { item } = props;
  return (
    <div className="card px-3 max-w-xl">
      <div
        style={{ backgroundImage: `url(${"/assets/row.png"})` }}
        className="bg-cover bg-center title py-2 px-10 text-3xl font-bold text-center font-serif"
      >
        {item.title}
      </div>
      <div className="text-black py-5 font-bold text-center ">
        { item.times?.map((time: string) => (
            <p key={time} className=" text-2xl ">
              {time}
            </p>
          ))}
        {item.description && (
          <p className="w-3/4 mx-auto">{item.description}</p>
        )}
      </div>
    </div>
  );
};

export default Card;
