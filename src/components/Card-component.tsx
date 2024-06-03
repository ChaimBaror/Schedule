import React, { useState } from "react";
import { formatTime as ft, generateFiveMinutes as gfm } from "@/utils/utils";
import {
  getCandleLightingTime,
  getDailyLearningDafYomi,
  getZmanim,
} from "@/services/hebcal.service";

interface Time {
  name?: string;
  val?: string;
  dynamic?: boolean;
  zman?: string;
  nimus?: number;
}

interface Item {
  title: string;
  times?: Time[];
  description?: string;
}

interface Props {
  item: Item;
}

const Card: React.FC<Props> = ({ item }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [formData, setFormData] = useState(item);

  const calculateDynamicTime = (time: Time) => {
    if (time.dynamic) {
      let calculatedTime = "";
      switch (time.zman) {
        case "shkiah":
          calculatedTime = gfm(getZmanim().shkiah(), time.nimus ?? 0);
          break;
        case "getDailyLearningDafYomi":
          calculatedTime = getDailyLearningDafYomi();
          break;
        case "CandleLightingTime":
          calculatedTime = gfm(getCandleLightingTime(), time.nimus ?? 0);
          break;
        default:
          calculatedTime = time.val;
      }
      return time.val ? `${time.val} : ${calculatedTime}` : calculatedTime;
    }
    return time.val;
  };

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index?: number,
    field?: string
  ) => {
    if (index !== undefined && field) {
      const updatedTimes = [...formData.times];
      updatedTimes[index] = { ...updatedTimes[index], [field]: e.target.value };
      setFormData({ ...formData, times: updatedTimes });
    } else {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement the logic to update the item with the new data in formData
    setIsPopupOpen(false);
  };

  return (
    <div className="relative card px-3 max-w-xl text-2xl group">
      <div
        className="bg-cover bg-center py-1 px-8 text-5xl font-bold text-center font-serif"
        style={{ backgroundImage: `url("/assets/row.png")` }}
      >
        {formData.title}
      </div>
      <div className="text-black py-5 font-bold text-center px-8">
        {formData.times?.map((time, index) => (
          <div
            key={index}
            className="flex items-center justify-center w-full mb-2"
          >
            {time.name && (
              <>
                <span className="whitespace-nowrap">{time.name}</span>
                <span className="flex-grow border-t border-black mx-2"></span>
              </>
            )}
            <span className="whitespace-nowrap">
              {calculateDynamicTime(time)}
            </span>
          </div>
        ))}
        {formData.description && (
          <p className="w-3/4 mx-auto text-base text-xl">
            {formData.description}
          </p>
        )}
      </div>
      <button
        className=" px-4 py-2 rounded absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={handleOpenPopup}
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
            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
          />
        </svg>
      </button>

      {isPopupOpen && (
        <div className="z-50 fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded shadow-lg">
            <h2 className="text-2xl mb-4">Edit Card</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              {formData.times?.map((time, index) => (
                <div key={index} className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Time {index + 1} Name
                  </label>
                  <input
                    type="text"
                    value={time.name}
                    onChange={(e) => handleInputChange(e, index, "name")}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                  <label className="block text-gray-700 text-sm font-bold mb-2 mt-2">
                    Time {index + 1} Value
                  </label>
                  <input
                    type="text"
                    value={time.val}
                    onChange={(e) => handleInputChange(e, index, "val")}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
              ))}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={handleClosePopup}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Card;
