export interface Time {
  val: string;
  dynamic?: boolean;
  zman?: "shkiah" | "CandleLightingTime" | "getDailyLearningDafYomi";
  nimus?: string;
  name?: string;
  roundToFiveMinutes?: boolean;
  /** @deprecated use roundToFiveMinutes */
  rond5minet?: boolean;
}

export interface Item {
  _id: string | number;
  title: string;
  times: Time[];
  description?: string;
  col?: string;
  index: number;
}
