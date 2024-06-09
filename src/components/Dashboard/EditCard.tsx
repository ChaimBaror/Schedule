import React, { useEffect, useState } from "react";

interface Props {
  handleClosePopup: () => void;
  formData: Item;
  setFormData: (item: Item) => void;
}

const EditCard: React.FC<Props> = ({
  handleClosePopup,
  formData,
  setFormData,
}) => {
  const [expandedTimes, setExpandedTimes] = useState<boolean[]>(
    formData.times.map(() => false)
  );

  const [editedFormData, setEditedFormData] = useState<Item>(formData);

  useEffect(() => {
    console.log("editedFormData", editedFormData);
  }, [editedFormData]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
    index?: number,
    field?: string
  ) => {
    if (index !== undefined && field) {
      const updatedTimes = [...editedFormData.times];
      updatedTimes[index] = { ...updatedTimes[index], [field]: e.target.value };
      setEditedFormData({ ...editedFormData, times: updatedTimes });
    } else {
      const { name, value } = e.target;
      setEditedFormData({ ...editedFormData, [name]: value });
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormData(editedFormData);
    handleClosePopup();
  };

  const handleAddTime = () => {
    setEditedFormData({
      ...editedFormData,
      times: [
        ...editedFormData.times,
        {
          val: "00:00 ",
          dynamic: false,
          zman: "שקיעה",
          nimus: "0",
          name: "חדש ",
        },
      ],
    });
  };
  const handleChangeIndex = (updatedTimes: Time[]) => {
    setEditedFormData({ ...editedFormData, times: updatedTimes });
  };
  const handleDeleteTime = (index: number) => {
    const updatedTimes = editedFormData.times.filter((_, i) => i !== index);
    setEditedFormData({ ...editedFormData, times: updatedTimes });
  };

  const toggleExpand = (index: number) => {
    const updatedExpandedTimes = [...expandedTimes];
    updatedExpandedTimes[index] = !updatedExpandedTimes[index];
    setExpandedTimes(updatedExpandedTimes);
  };

  const moveItemUp = (index: number) => {
    if (index > 0) {
      const updatedTimes = [...editedFormData.times];
      const temp = updatedTimes[index - 1];
      updatedTimes[index - 1] = updatedTimes[index];
      updatedTimes[index] = temp;
      handleChangeIndex(updatedTimes);
    }
  };

  // Function to move item down
  const moveItemDown = (index: number) => {
    if (index < editedFormData.times.length - 1) {
      const updatedTimes = [...editedFormData.times];
      const temp = updatedTimes[index + 1];
      updatedTimes[index + 1] = updatedTimes[index];
      updatedTimes[index] = temp;
      handleChangeIndex(updatedTimes);
    }
  };

  return (
    <div className="z-50 fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div
        className="bg-white p-8 rounded-lg shadow-2xl max-w-lg w-full"
        style={{ backgroundImage: `url("/assets/dashboard-2.png")` }}
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-800 bg-gray-200">Edit Item</h2>
        <form onSubmit={handleFormSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={editedFormData.title}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          {editedFormData.times?.map((time, index) => (
            <div key={index} className="mb-6 bg-g p-8 rounded-lg shadow-2xl bg-gray-200">
              <div className="flex justify-between items-center">
                <label className="block text-gray-700 text-sm font-bold">
                  {time.name || time.val || "Time" + " " + (index + 1)}
                </label>
                <div>
                  <button
                    type="button"
                    onClick={() => moveItemUp(index)}
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
                    onClick={() => moveItemDown(index)}
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
                <div>
                  <button
                    type="button"
                    onClick={() => toggleExpand(index)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline mr-2"
                  >
                    {expandedTimes[index] ? (
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
                          d="m19.5 8.25-7.5 7.5-7.5-7.5"
                        />
                      </svg>
                    ) : (
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
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                        />
                      </svg>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteTime(index)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
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
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              {expandedTimes[index] && (
                <>
                    <>
                      <label className="block text-gray-700 text-sm font-bold mb-2 mt-2">
                        Name
                      </label>
                      <input
                        placeholder="Name_______00:00"
                        type="text"
                        value={time.name}
                        onChange={(e) => handleInputChange(e, index, "name")}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </>
               
                    <>
                      <label className="block text-gray-700 text-sm font-bold mb-2 mt-2">
                        Value
                      </label>
                      <input
                        placeholder="name : 10:00"
                        type="text"
                        value={time.val}
                        onChange={(e) => handleInputChange(e, index, "val")}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </>
                 

                  <>
                    <label className="block text-gray-700 text-sm font-bold mb-2 mt-2">
                      Dynamic
                    </label>
                    <div className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        checked={time.dynamic}
                        onChange={(e) => handleInputChange(e, index, "dynamic")}
                        className="mr-2 leading-tight"
                      />
                      <span className="text-gray-700">Dynamic</span>
                    </div>
                  </>

                    <>
                      <label className="block text-gray-700 text-sm font-bold mb-2 mt-2">
                        Zman
                      </label>
                      <select
                        value={time.zman}
                        onChange={(e) => handleInputChange(e, index, "zman")}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      >
                        <option value="shkiah">Shkiah</option>
                        <option value="getDailyLearningDafYomi">
                          Daf Yomi
                        </option>
                        <option value="CandleLightingTime">
                          Candle Lighting
                        </option>
                      </select>
                    </>
                
                    <>
                      <label className="block text-gray-700 text-sm font-bold mb-2 mt-2">
                        Nimus
                      </label>
                      <input
                        type="text"
                        value={time.nimus}
                        onChange={(e) => handleInputChange(e, index, "nimus")}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </>
                 
                </>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddTime}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4"
          >
            + Add Time
          </button>
          {editedFormData.description !== undefined && (
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={editedFormData.description}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
          )}
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
  );
};

export default EditCard;
