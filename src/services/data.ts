
const Right: Item[] = [
    {
      _id: 1,
      title: "שחרית יום חול",
      times: [{ val: " *06:15", name: "שחרית א" }, { name: "שחרית ב", val: "08:10 " }],
      description: "*בראש חודש ובתענית ציבור נא לעקוב אחרי המודעות",
      col: "Right",
    },
    {
      _id: 2,
      title: "מנחה יום חול",
      times: [{ val: ``, dynamic: true, zman: "shkiah", nimus: '-15', rond5minet: true }],
      description: "כרבע שעה לפני השקיעה שיעור בין מנחה לערבית בנושאים שונים",
      col: "Right",
    },
    {
      _id: 3,
      title: "ערבית יום חול",
      times: [
        { val: "", name: `ערבית א`, dynamic: true, zman: "shkiah", nimus: '20', rond5minet: true },
        { val: "עשרים דקות אחרי השקיעה" },
        { name: `ערבית ב`, val: " 22:30 " },
      ],
      col: "Right",
    },
  ];
  
  const Medium: Item[] = [
    {
      _id: 4,
      title: "מנחה ערב שבת",
      times: [{ val: "עשר דקות לאחר הדלקת נרות" },
      { val: ` הדלקת נרות 🕯️🕯️`, dynamic: true, zman: "CandleLightingTime", nimus: '-2' },
      ],
      col: "Medium",
    },
    {
      _id: 5,
      title: "ערבית ליל שבת",
      description: "כחצי שעה לאחר השקיעה",
      times: [{ val: ``, dynamic: true, zman: "CandleLightingTime", nimus: '50' },
      ],
      col: "Medium",
    },
    {
      _id: 6,
      title: "שחרית יום שבת",
      description: "שיעור בגמרא ובהלכה מיד לאחר תפילת שחרית בשבת",
      times: [{ val: "08:00" }],
      col: "Medium",
    },
  
  ];
  
  const Left: Item[] = [
    {
      _id: 7,
      title: "אבות ובנים",
      description: "",
      times: [{ val: "קיץ: 45 דקות קודם מנחה" }, { val: "חורף: אחר תפילת ערבית של מוצש\"ק" }],
      col: "Left",
    },
    {
      _id: 8,
      title: "מנחה שבת",
      description: "עשר דקות קודם הדלקת נרות",
      times: [{ val: ``, dynamic: true, zman: "CandleLightingTime", nimus: '-10' },],
      col: "Left",
    },
    {
      _id: 9,
      title: `ערבית מוצש"ק`,
      times: [{ val: ``, dynamic: true, zman: "CandleLightingTime", nimus: '60' }],
      description: "בזמן צאת שבת",
      col: "Left",
    },
    {
      _id: 10,
      title: "שיעור הדף היומי",
      description: `שיעור א: בשעה 5:40 בבוקר\n\nשיעור ב: לאחר שחרית מניין ב`,
      times: [{ val: ``, dynamic: true, zman: "getDailyLearningDafYomi" }],
      col: "Left",
    },
  ];

  export { Right, Medium, Left };