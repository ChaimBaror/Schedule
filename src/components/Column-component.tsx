import React, { Suspense, useState } from "react";
import Card from "./Card-component";
import { postItems, putItems } from "@/services/time.service";
import { Button } from "./Button";

interface ColumnProps {
  items: Item[];
}

const Column: React.FC<ColumnProps> = ({ items }) => {
  const [listItems, setListItems] = useState<Item[]>(items);
  console.log("items Column", items);

  const updatedList = () => {
    console.log("updatedTimes", listItems);

    listItems.map((item, index) =>
      putItems({ ...item, index: index})
    );
  };

  const handleAddItem = (item: Item) => {
    setListItems([...listItems, item]);
  };

  const handleDeleteItem = (item: Item) => {
    // setListItems(listItems.filter((i) => i. !== item.uid));
  };

  const handleEditItem = (item: Item) => {
    console.log("handleEditItem ", item);
    
    setListItems(listItems.map((i) => (i._id === item._id ? item : i)));
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="grid grid-cols-1  max-w-[400px] lg:max-w-[28%] ">
        <Button onClick={updatedList}>updatate list </Button>
        {items?.map((item, index) => (
          <Card item={item} key={index} onEdit={handleEditItem} onDelete={handleDeleteItem} />
        ))}
      </div>
    </Suspense>
  );
};

export default Column;
