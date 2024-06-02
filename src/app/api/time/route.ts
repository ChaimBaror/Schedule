import { Item } from "@/types/items";
import { NextResponse } from "next/server";

const items: Item[] = [
    {
        title: "שחרית יום חול",
        times: [{ val: "מניין א ___________*06:15" }, { val: "מניין ב ___________08:10" }],
        description: "*בראש חודש ובתענית ציבור נא לעקוב אחרי המודעות",
    },
    {
        title: "מנחה יום חול",
        times: [{ val: ``, dynamic: true, zman: "shkiah", nimus: -15 }],
        description: "כרבע שעה לפני השקיעה שיעור בין מנחה לערבית בנושאים שונים",
    },
    {
        title: "ערבית יום חול",
        times: [
            { val: `מניין א`, dynamic: true, zman: "shkiah", nimus: 20 },
            { val: "עשרים דקות אחרי השקיעה" },
            { val: "מניין נוסף ________22:30" },
        ],
    },
];

const items2: Item[] = [
    {
        title: "מנחה ערב שבת",
        times: [{ val: "עשר דקות לאחר הדלקת נרות" }],
        // description: `${ft(getZmanim().shkiah(), -20)}: הדלקת נרות`,
    },
    {
        title: "ערבית ליל שבת",
        description: "כחצי שעה לאחר השקיעה",
        times: [{ val: ``, dynamic: true, zman: "shkiah", nimus: 30 },
    ],
    },
    {
        title: "שחרית יום שבת",
        description: "שיעור בגמרא ובהלכה מיד לאחר תפילת שחרית בשבת",
        times: [{ val: "08:00" }],
    },
];

const items3: Item[] = [
    {
        title: "אבות ובנים",
        description: "",
        times: [{ val: "קיץ: 45 דקות קודם מנחה" }, { val: "חורף: אחר תפילת ערבית של מוצש\"ק" }],
    },
    {
        title: "מנחה שבת",
        description: "עשר דקות קודם הדלקת נרות",
        times: [{ val: ``, dynamic: true, zman: "shkiah", nimus: -30 }],
    },
    {
        title: `ערבית מוצש"ק`,
        times: [{ val: "בחורף: בזמן צאת שבת" }, { val: "בקיץ: 5 דקות קודם יציאת שבת" }],
    },
    {
        title: "שיעור הדף היומי",
        description: `שיעור א: בשעה 5:40 בבוקר\nשיעור ב: לאחר שחרית מניין ב`,
        times: [{ val: ``, dynamic: true, zman: "getDailyLearningDafYomi"}],
    },
];

export async function GET() {
    return NextResponse.json({ items, items2, items3 });
}

// export async function GET() {
//     const snapshot: FirebaseFirestore.QuerySnapshot = await firebase.collection("times").get();
//     const items = snapshot.docs.map(doc => doc.data());
//     console.log("Snapshot", items);
    
//     return NextResponse.json({ snapshot });
// }
