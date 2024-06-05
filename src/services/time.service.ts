
export async function getTimeList() {
    try {
      const res = await fetch(`/api/items/`);
      const { items, items2, items3 } = await res.json();
      console.log(items, items2, items3);
      
      return { ColumnL: items, ColumnM: items2, ColumnR: items3 };
      // const {left, right, medium } = await res.json();
      // console.log(left, right, medium);
      
      // return { ColumnL: left, ColumnM: right, ColumnR: medium };
    } catch (error) {
      console.error('Error fetching time list:', error);
      return { ColumnL: [], ColumnM: [], ColumnR: [] };
    }
  }
  
  export async function posItems(item) {
    console.log("items ", item);
    
    try {
      const res = await fetch(`/api/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(item) // Pass item data in the request body
      });
  
      if (!res.ok) {
        throw new Error('Failed to post items');
      }
  
      return await res.json();
    } catch (error) {
      console.error('Error posting items:', error);
      return { success: false };
    }
  }
  