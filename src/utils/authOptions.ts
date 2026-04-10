import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

const API_URL = process.env.NEXT_PUBLIC_BASE_API || "https://api-express-schedule.vercel.app";

export const authOptions: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_SECRET as string,
        }),
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                try {
                    const res = await fetch(`${API_URL}/auth/login`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            email: credentials.email,
                            password: credentials.password,
                        }),
                    });

                    if (!res.ok) return null;

                    const user = await res.json();
                    return {
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        phone: user.phone,
                        kehilaSlugs: user.kehilaSlugs,
                        hasPassword: true,
                    };
                } catch {
                    return null;
                }
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET!,
    pages: {
        signIn: "/signin",
    },
    callbacks: {
        async signIn({ user, account }) {
            // On Google sign-in, sync user to backend DB
            if (account?.provider === "google") {
                try {
                    const res = await fetch(`${API_URL}/auth/google`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            name: user.name,
                            email: user.email,
                            googleId: account.providerAccountId,
                        }),
                    });

                    if (res.ok) {
                        const dbUser = await res.json();
                        user.role = dbUser.role;
                        user.phone = dbUser.phone;
                        user.kehilaSlugs = dbUser.kehilaSlugs;
                        user.hasPassword = dbUser.hasPassword;
                    }
                } catch {
                    // Allow sign-in even if backend sync fails
                }
            }
            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role || "user";
                token.phone = user.phone || "";
                token.kehilaSlugs = user.kehilaSlugs || [];
                token.hasPassword = user.hasPassword || false;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.role = token.role;
                session.user.phone = token.phone;
                session.user.kehilaSlugs = token.kehilaSlugs;
                session.user.hasPassword = token.hasPassword;
            }
            return session;
        },
    },
};
