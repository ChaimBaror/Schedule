import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";


const beatUrl = process.env.NEXT_PUBLIC_BASE_API || "https://api-express-schedule.vercel.app"
const url = `${beatUrl}/api/item/`

export async function GET() {

  try {
    const response = await fetch(`${url}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    console.log(data);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
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

export async function DELETE(id: string) {
  const res = await fetch(url + `/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'API-Key': process.env.DATA_API_KEY!,
    },
  })

  const data = await res.json()

  return Response.json(data)
}

export async function PUT(id: string) {
  const res = await fetch(url + `/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'API-Key': process.env.DATA_API_KEY!,
    },
    body: JSON.stringify({ time: new Date().toISOString() }),
  })

  const data = await res.json()

  return Response.json(data)
}

