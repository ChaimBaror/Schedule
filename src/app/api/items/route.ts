import { NextResponse } from "next/server";
import { Right, Medium, Left } from "@/services/data";

const baseUrl = process.env.NEXT_PUBLIC_BASE_API || "https://api-express-schedule.vercel.app";
const url = `${baseUrl}/api/item/`;

export async function GET() {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!response.ok) throw new Error("API error");
    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ right: Right, medium: Medium, left: Left });
  }
}

export async function POST() {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'API-Key': process.env.DATA_API_KEY!,
      },
      body: JSON.stringify({ time: new Date().toISOString() }),
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to post item" }, { status: 500 });
  }
}
