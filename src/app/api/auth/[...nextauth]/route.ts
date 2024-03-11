import nextAuth from "next-auth";
import ProvidersGoogle from "next-auth/providers/google";


export const authOptions = {
    providers: [
        ProvidersGoogle({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_SECRET!,
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET!,
    pages: {
        signIn: "/signin",
    }

}
const hendler = nextAuth(authOptions);

export { hendler as GET, hendler as POST };



