import nextAuth, { AuthOptions } from "next-auth";
import ProvidersGoogle from "next-auth/providers/google";


export const authOptions: AuthOptions = {
    providers: [
        ProvidersGoogle({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_SECRET as string,
        }),
    ],
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET!,
    pages: {
        signIn: "/signin",
    }

}




