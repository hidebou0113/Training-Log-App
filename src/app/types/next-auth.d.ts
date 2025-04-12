import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
    } & DefaultSession["user"];
  }
  interface User extends DefaultUser {
    id: string;
    role?: string;
  }

  interface JWT {
    id?: string;
    role?: string;
    accessToken?: string;
  }
}
