
const beatUrl = process.env.NEXT_PUBLIC_BASE_API || "https://api-express-schedule.vercel.app"
console.log("beatUrl", beatUrl);
console.log("process.env.BASE_API", process.env.NEXT_PUBLIC_BASE_API);
import { Right, Medium, Left } from "@/services/data";


const url = `${beatUrl}/api/item/`

export function getTimeList() {
  return { Right, Medium, Left };
}


export const dataFetch = async () => {
  try {

    const response = await fetch(`/api/items/`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const postItems = async (itemData: Item) => {
  console.log("postItems", itemData);

  try {
    const response = await fetch(`${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(itemData), // Include the item data in the request body
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await response.json();
    console.log("Item posted successfully:", result);
  } catch (error) {
    console.error("Error posting items:", error);
  }
};

export const deleteItems = async (id: string) => {
  try {
    const response = await fetch(`${url}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    } 

    const result = await response.json();
    console.log("Item deleted successfully:", result);

  } catch (error) {
    console.error("Error deleting item:", error);
  }
};

export const putItems = async (itemData: Item) => {
  console.log("putItems", itemData);
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(itemData), // Include the item data in the request body
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await response.json();
    console.log("Item updated successfully:", result);
  } catch (error) {
    console.error("Error updating item:", error);
    
  }

};

