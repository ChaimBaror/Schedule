
const url = process.env.NEXT_PUBLIC_BASE_URL;

export async function getTimeList() {
   const res = await  fetch(`${url}/api/time/`)
    const { items, items2, items3 } = await res.json();
    console.log(items, items2, items3);
    
    return { items, items2, items3 };
}