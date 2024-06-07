interface Time {
  val: string;
  dynamic?: boolean;
  zman?: string;
  nimus?: string;
  name?: string;
  rond5minet?: boolean;
}

interface Item {
  _id?: string | number;
  title: string;
  times: Time[];
  description?: string;
  col?: string;
  index?: number | string;
}