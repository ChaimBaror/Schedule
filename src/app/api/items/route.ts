import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import { Right, Medium, Left } from "@/services/data";


const beatUrl = process.env.beatUrl || "http://localhost:8000"
const url = `${beatUrl}/api/item/`

// export async function GET() {
//     const res = await fetch(url, {
//         // headers: {
//         //     'Content-Type': 'application/json',
//         //     'API-Key': process.env.DATA_API_KEY,
//         // },
//     })
//     const data = await res.json()

//     return Response.json({ data })
// }
export async function GET() {
  return NextResponse.json({ Right, Medium, Left });
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

