interface Time {
  val: string;
  dynamic?: boolean;
  zman?: string;
  nimus?: string ;
  name?: string;
  rond5minet?: boolean;
}

interface Item {
  title: string;
  times: Time[];
  description?: string;
}