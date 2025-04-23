import prisma, { connectDB } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

//筋トレ全記録取得API
export const GET = async () => {
  try {
    await connectDB();
    const posts = await prisma.post.findMany({
      include: {
        menu: true,
        user: true,
      },
      orderBy: {
        date: "desc",
      },
    });
    return NextResponse.json({ message: "Success", posts }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  }
};

//筋トレ記録投稿API
export const POST = async (req: Request) => {
  try {
    const { userId, menuId, weight, reps, sets, date } = await req.json();

    if (!userId || !menuId || weight === undefined || !reps || !sets) {
      return NextResponse.json(
        {
          message: "必須フィールドがありません",
          err: { missing: { userId, menuId, weight, reps, sets } },
        },
        { status: 400 }
      );
    }
    await connectDB();
    const post = await prisma.post.create({
      data: {
        userId,
        menuId: Number(menuId),
        weight: Number(weight),
        reps: Number(reps),
        sets: Number(sets),
        date,
      },
      include: {
        user: true,
        menu: true,
      },
    });
    return NextResponse.json({ message: "Success", post }, { status: 201 });
  } catch (err) {
    console.error("API POST エラー詳細:", err);
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  }
};
