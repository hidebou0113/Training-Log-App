import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "../prisma";
import { compare } from "bcryptjs";

export const nextAuthOptions: NextAuthOptions = {
  debug: true,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
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

        const isValid = await compare(
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
  adapter: PrismaAdapter(prisma),
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      const isAllowedToSignIn = true;
      return isAllowedToSignIn;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
