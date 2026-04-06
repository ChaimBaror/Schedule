import React, { Suspense, useEffect, useState } from "react";
import Card from "./CardComponent";
import EditColumn from "./EditColumn";
import type { Item } from "@/types/items";

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
    <Suspense fallback={<div className="text-white text-center p-4">טוען...</div>}>
      {/* Mobile: fixed card width with snap. Desktop: fills grid column */}
      <div className="min-w-[85vw] sm:min-w-[65vw] lg:min-w-0 snap-start flex-shrink-0 lg:flex-shrink grid grid-cols-1">
        {listItems
          .sort((a, b) => a.index - b.index)
          .map((item) => (
            <Card
              key={item._id}
              item={item}
              onEdit={() => setIsPopupOpen(true)}
            />
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
