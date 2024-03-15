

export async function getTimeList() {
   const res = await  fetch(`/api/time/`)
    const { items, items2, items3 } = await res.json();
    console.log(items, items2, items3);
    
    return { ColumnL: items, ColumnM: items2, ColumnR: items3 };
}