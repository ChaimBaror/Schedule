import { getZmanim, getDailyLearningDafYomi } from "@/services/hebcal.service";
import { Item } from "@/types/items";
// import { firebase } from "@/firebase";
import { formatTime as ft, generateFiveMinutes as gfm } from "@/utils/utils";
import { NextResponse } from "next/server";

const items: Item[] = [
    {
        title: "שחרית יום חול",
        times: [" מניין א ___________*06:15 ", "מניין ב ___________08:10 "],
        description: "*בראש חודש ובתענית ציבור נא לעקוב אחרי המודעות",
    },
    {
        title: "מנחה יום חול",
        times: [`${gfm(getZmanim().shkiah(), -15)}`],
        description: "כרבע שעה לפני השקיעה שיעור בין מנחה לערבית בנושאים שונים",
    },
    {
        title: "ערבית יום חול",
        times: [
            `מניין א ___________  ${gfm(getZmanim().shkiah(), 20)} `,
            "עשרים דקות אחרי השקיעה",
            "מניין נוסף ________22:30 ",
        ],
    },
];

const items2: Item[] = [
    {
        title: "מנחה ערב שבת",
        times: ["עשר דקות לאחר הדלקת נרות"],
        description: `${ft(getZmanim().shkiah(), -20)}: הדלקת נרות `,
    },
    {
        title: "ערבית ליל שבת",
        description: " כחצי שעה לאחר השקיעה",
        times: [`${ft(getZmanim().shkiah(), 30)}`],
    },
    {
        title: "שחרית יום שבת",
        description: "שיעור בגמרא ובהלכה מיד לאחר תפילת שחרית בשבת",
        times: ["08:00"],
    },
];

const items3: Item[] = [
    {
        title: "אבות ובנים ",
        description: "",
        times: ["קיץ : 45 דקות קודם מנחה", 'חורף : אחר תפילת ערבית של מוצש"ק'],
    },
    {
        title: "מנחה שבת",
        description: "עשר דקות קודם הדלקת נרות ",
        times: [`${ft(getZmanim().shkiah(), -30)}`],
    },
    {
        title: `ערבית מוצש"ק `,
        times: ["בחורף: בזמן צאת שבת", "בקיץ: 5 דקות קודם יציאת שבת"],
    },
    {
        title: "שיעור הדף היומי ",
        description: `שיעור א : בשעה 5:40 בבוקר  \n שיעור ב : לאחר שחרית מניין ב`,
        times: [`${getDailyLearningDafYomi()}`],
    },
];
export async function GET() {
    return NextResponse.json({ items, items2, items3 });
}

// export async function GET() {
//     const Snapshot :FirebaseFirestore.QuerySnapshot = await firebase.collection("times").get();
//     const items = Snapshot.docs.map(doc => doc.data());
//     console.log("Snapshot", items);
    
//     return NextResponse.json({ Snapshot });



// }