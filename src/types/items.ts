interface Time {
  val: string;
  dynamic?: boolean;
  zman?: string;
  nimus?: number;
}

interface Item {
  title: string;
  times: Time[];
  description?: string;
}