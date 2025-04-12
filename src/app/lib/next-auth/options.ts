import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "../prisma";
import bcrypt from "bcryptjs";
import Credentials from "next-auth/providers/credentials";

export const nextAuthOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "your@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("入力されたメール:", credentials?.email);
        const user = await prisma.user.findUnique({
          where: { email: credentials?.email },
        });
        console.log("データベースから取得したユーザー:", user);
        if (!user) {
          throw new Error("そのメールアドレスのユーザーは存在しません");
        }

        const isValid = await bcrypt.compare(
          credentials!.password,
          user.password || ""
        );
        console.log("パスワード照合結果:", isValid);

        if (!isValid) {
          throw new Error("パスワードが正しくありません");
        }
        return user;
      },
    }),
  ],

  pages: {
    signIn: "/auth",
  },
  debug: process.env.NODE_ENV === "development",
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: process.env.NEXTAUTH_JWT_SECRET,
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.user = user;
        token.role = user.role;
      }
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          role: token.role,
          id: token.sub,
        },
      };
    },
  },
};
