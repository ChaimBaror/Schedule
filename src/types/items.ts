interface Time {
  val: string;
  dynamic?: boolean;
  zman?: string;
  nimus?: number;
  name?: string;
}

interface Item {
  title: string;
  times: Time[];
  description?: string;
}