import React, { useState } from "react";
import { Button } from "../Button";
import { postItems } from "@/services/time.service";
import EditCard from "./EditCard";

interface Props {
  handleClosePopup: () => void;
  listItems: Item[];
  setListItems: (items: Item[]) => void;
}

const EditColumn: React.FC<Props> = ({
  handleClosePopup,
  listItems,
  setListItems,
}) => {
  const [listItemsState, setListItemsState] = useState<Item[]>(listItems);
  const [isPopupOpenItem, setIsPopupOpenItem] = useState(false);
  const [formData, setFormData] = useState<Item>(listItems[0]);
  const [updatateAndSave, setUpdatateAndSave] = useState(false);

  const [col, setCol] = useState<string>(listItems[0].col || "");

  const handleAddTime = () => {
    setListItemsState(
      [...listItemsState, {
      _id: "",
      title: "new time",
      description: "a new time",
      times: [],
      col: col,
      index: listItemsState.length + 1,
    }]
    );
    
  };

  const handleDeleteItem = (item: Item) => {
    setListItems(listItems.filter((i) => i._id !== item._id));
  };

  //   const handleEditItem = (item: Item) => {
  //     console.log("handleEditItem ", item);
  //     setListItems(listItems.map((i) => (i._id === item._id ? item : i)));
  //   };

  const handleMoveItemUp = (index: number) => {
    if (index > 0) {
      const newList = [...listItemsState];
      const temp = newList[index - 1];
      newList[index - 1] = newList[index];
      newList[index] = temp;
      setListItemsState(newList);
    }
  };

  const handleMoveItemDown = (index: number) => {
    if (index < listItems.length - 1) {
      const newList = [...listItemsState];
      const temp = newList[index + 1];
      newList[index + 1] = newList[index];
      newList[index] = temp;
      setListItemsState(newList);
    }
  };

  const updatedList = () => {
    listItemsState.map((item, index) => postItems({ ...item, index: index }));
    handleClosePopup();
  };

  const handleOpenPopup = (time: Item) => {
    setFormData(time);
    setIsPopupOpenItem(true);
  };

  const handleFormData = (formData: Item) => {
    setListItemsState(
      listItemsState.map((item) =>
        item._id === formData._id ? formData : item
      )
    );
  };

  const handleDataList = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setListItems(listItemsState);
    setUpdatateAndSave(true);
  };

  return (
    <div className="z-50 fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div
        className="bg-white p-8 rounded-lg shadow-2xl max-w-lg w-full"
        style={{ backgroundImage: `url("/assets/dashboard-2.png")` }}
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Edit Column</h2>
        <form onSubmit={handleDataList}>
          {listItemsState.map((time, index) => (
            <div
              key={index}
              className="mb-6 bg-g p-8 rounded-lg shadow-2xl"
              style={{ backgroundImage: `url("/assets/row.png")` }}
            >
              <div className="flex justify-between items-center">
                <div className="mb-6">
                  <input
                    onClick={() => handleOpenPopup(time)}
                    type="text"
                    name="title"
                    value={time.title}
                    className=" py-1 px-2 text-5xl font-bold text-center font-serif shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => handleMoveItemUp(index)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline mr-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveItemDown(index)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-between">
            {updatateAndSave ? (
              <Button
                onClick={() => updatedList()}
                type="button"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Save
              </Button>
            ) : (
              <Button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Update
              </Button>
            )}
            <Button
              type="button"
              onClick={handleAddTime}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4"
            >
              + Add Time
            </Button>
            <Button
              onClick={() => handleClosePopup()}
              type="button"
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
      {isPopupOpenItem && (
        <EditCard
          handleClosePopup={() => setIsPopupOpenItem(false)}
          formData={formData}
          setFormData={handleFormData}
        />
      )}
    </div>
  );
};

export default EditColumn;
