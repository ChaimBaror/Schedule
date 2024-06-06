interface Time {
  val: string;
  dynamic?: boolean;
  zman?: string;
  nimus?: string ;
  name?: string;
  rond5minet?: boolean;
}

interface Item {
  uid?: string | number;
  title: string;
  times: Time[];
  description?: string;
  col?: string;
}