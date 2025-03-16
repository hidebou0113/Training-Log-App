import { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";

export const config: NextAuthConfig = {
  providers: [GitHub],
  basePath: "/api/auth",
  callbacks: {
    authorized({ request, auth }) {
      try {
        const { pathname } = request.nextUrl;
        if (pathname === "/protected-page") return !!auth;
        return true;
      } catch (err) {
        console.log(err);
      }
    },
  },
};
