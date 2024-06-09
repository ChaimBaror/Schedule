import React, { Suspense, useEffect, useState } from "react";
import Card from "./CardComponent";
import EditColumn from "./EditColumn";


interface ColumnProps {
  items: Item[];
}

const Column: React.FC<ColumnProps> = ({ items }) => {
  const [listItems, setListItems] = useState<Item[]>(items);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    setListItems(items);
  }, [items]);


  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="grid grid-cols-1 max-w-[400px] lg:max-w-[28%]">
        {listItems
          ?.sort((a, b) => a.index - b.index)
          .map((item, index) => (
            <div key={item._id}>
              <Card
                item={item}
                key={index}
                onEdit={() => setIsPopupOpen(true)}
              />
            </div>
          ))}
        {isPopupOpen && (
          <EditColumn
            handleClosePopup={() => setIsPopupOpen(false)}
            listItems={listItems}
            setListItems={setListItems}
          />
        )}
      </div>
    </Suspense>
  );
};

export default Column;
