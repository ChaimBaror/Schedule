import { NextResponse } from "next/server";
import { Right, Medium, Left } from "@/services/data";

const beatUrl = process.env.NEXT_PUBLIC_BASE_API || "https://api-express-schedule.vercel.app"
const url = `${beatUrl}/api/item/`

export async function GET() {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!response.ok) throw new Error("API error");
    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    // Fallback to local default data when external API is unavailable
    return NextResponse.json({ right: Right, medium: Medium, left: Left });
  }
}

export async function POST() {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'API-Key': process.env.DATA_API_KEY!,
    },
    body: JSON.stringify({ time: new Date().toISOString() }),
  })

  const data = await res.json()

  return Response.json(data)
}

// export async function DELETE(id: string) {
//   const res = await fetch(url + `/${id}`, {
//     method: 'DELETE',
//     headers: {
//       'Content-Type': 'application/json',
//       'API-Key': process.env.DATA_API_KEY!,
//     },
//   })

//   const data = await res.json()

//   return Response.json(data)
// }
