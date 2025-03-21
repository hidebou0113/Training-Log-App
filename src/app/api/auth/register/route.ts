import prisma from "@/app/lib/prisma";
import { hash } from "bcryptjs";
import {} from "next";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

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
    const hashedPassword = await hash(password, 12);

    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
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
