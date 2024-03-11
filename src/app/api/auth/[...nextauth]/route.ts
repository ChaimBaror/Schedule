import { authOptions } from "@/utils/authOptions";
import nextAuth from "next-auth";

const hendler = nextAuth(authOptions);

export { hendler as GET, hendler as POST };



