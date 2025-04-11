declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
    };
  }
}
interface User extends DefaultUser {
  role?: string;
}

interface JWT {
  role?: string;
  accessToken?: string;
}
