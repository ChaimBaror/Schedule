import type { Item } from "@/types/items";
import { Right, Medium, Left } from "@/services/data";

const baseUrl = process.env.NEXT_PUBLIC_BASE_API || "https://api-express-schedule.vercel.app";
const url = `${baseUrl}/api/item/`;

export function getTimeList() {
  return { Right, Medium, Left };
}

export const dataFetch = async () => {
  try {
    const response = await fetch(`/api/items/`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const postItems = async (itemData: Item) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(itemData),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return await response.json();
  } catch (error) {
    console.error("Error posting items:", error);
  }
};

export const deleteItems = async (id: string) => {
  try {
    const response = await fetch(`${url}${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting item:", error);
  }
};

