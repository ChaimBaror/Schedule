export async function getTimeList() {
  try {
    const res = await fetch(`/api/items/`);
    const { Right, Medium, Left } = await res.json();
    console.log(Right, Medium, Left);

    return { Right, Medium, Left };
  } catch (error) {
    console.error('Error fetching time list:', error);
    return { ColumnL: [], ColumnM: [], ColumnR: [] };
  }
}

export const dataFetch = async () => {
  try {
    const response = await fetch('http://localhost:8000/api/item/');
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
    const response = await fetch(`http://localhost:8000/api/item/`, {
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