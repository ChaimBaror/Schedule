import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

const items: Item[] = [
    {
        "title": "שחרית יום חול",
        "times": [
          { "val": " *06:15", "name": "שחרית א" },
          { "name": "שחרית ב", "val": "08:10" }
        ],
        "description": "*בראש חודש ובתענית ציבור נא לעקוב אחרי המודעות"
      },
      {
        "title": "מנחה יום חול",
        "times": [ { "val": "", "dynamic": true, "zman": "shkiah", "nimus": "-15", "rond5minet": true } ],
        "description": "כרבע שעה לפני השקיעה שיעור בין מנחה לערבית בנושאים שונים"
      },
      {
        "title": "ערבית יום חול",
        "times": [
          { "val": "", "name": "ערבית א", "dynamic": true, "zman": "shkiah", "nimus": "20", "rond5minet": true },
          { "val": "עשרים דקות אחרי השקיעה" },
          { "name": "ערבית ב", "val": "22:30" }
        ]
      }
];

const items2: Item[] = [
    {
        "title": "מנחה ערב שבת",
        "times": [
          { "val": "עשר דקות לאחר הדלקת נרות" },
          { "val": "הדלקת נרות 🕯️🕯️", "dynamic": true, "zman": "CandleLightingTime", "nimus": "-2" }
        ]
      },
      {
        "title": "ערבית ליל שבת",
        "description": "כחצי שעה לאחר השקיעה",
        "times": [
          { "val": "", "dynamic": true, "zman": "CandleLightingTime", "nimus": "50" }
        ]
      },
      {
        "title": "שחרית יום שבת",
        "description": "שיעור בגמרא ובהלכה מיד לאחר תפילת שחרית בשבת",
        "times": [
          { "val": "08:00" }
        ]
      }
];

const items3: Item[] = [
    {
        "title": "אבות ובנים",
        "times": [
          { "val": "קיץ: 45 דקות קודם מנחה" },
          { "val": "חורף: אחר תפילת ערבית של מוצש\"ק" }
        ]
      },
      {
        "title": "מנחה שבת",
        "description": "עשר דקות קודם הדלקת נרות",
        "times": [
          { "val": "", "dynamic": true, "zman": "CandleLightingTime", "nimus": "-10" }
        ]
      },
      {
        "title": "ערבית מוצש\"ק",
        "times": [
          { "val": "", "dynamic": true, "zman": "CandleLightingTime", "nimus": "60" }
        ],
        "description": "בזמן צאת שבת"
      },
      {
        "title": "שיעור הדף היומי",
        "description": "שיעור א: בשעה 5:40 בבוקר\n\nשיעור ב: לאחר שחרית מניין ב",
        "times": [
          { "val": "", "dynamic": true, "zman": "getDailyLearningDafYomi" }
        ]
      }
];


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
    return NextResponse.json({ items, items2, items3 });
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

export async function PUT() {
    return NextResponse.json({ items, items2, items3 });
}

export async function DELETE() {

  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'API-Key': process.env.DATA_API_KEY!,
    },
  })
    return NextResponse.json({ items, items2, items3 });
}

