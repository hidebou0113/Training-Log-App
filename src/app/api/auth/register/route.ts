import prisma from "@/app/lib/prisma";
import bcrypt from "bcryptjs";
import {} from "next";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { status: 400 },
        { message: "メールアドレス、パスワード、名前は必須です" }
      );
    }
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { status: 400 },
        { message: "このメールアドレスはすでに登録されています" }
      );
    }
    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        image: "",
        emailVerified: new Date(),
      },
    });
    return NextResponse.json(
      { status: 201 },
      { message: "ユーザー登録に成功しました。", user: newUser }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { status: 500 },
      { message: "サーバーエラーが発生しました。", error }
    );
  }
}
