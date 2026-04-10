import "next-auth";

declare module "next-auth" {
  interface User {
    role?: string;
    phone?: string;
    kehilaSlugs?: string[];
    hasPassword?: boolean;
  }

  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
      phone?: string;
      kehilaSlugs?: string[];
      hasPassword?: boolean;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    phone?: string;
    kehilaSlugs?: string[];
    hasPassword?: boolean;
  }
}
