
export async function getTimeList() {
   const res = await  fetch('http://localhost:3000/api/time/')
    const { items, items2, items3 } = await res.json();
    console.log(items, items2, items3);
    
    return { items, items2, items3 };
}