import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$connect();
  } catch (err) {
    console.log("DB接続に失敗", err);
    throw new Error("DB接続に失敗");
  }
}

//筋トレ全記録取得API
export const GET = async () => {
  try {
    await main();
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
  } finally {
    await prisma.$disconnect();
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
    await main();
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
  } finally {
    await prisma.$disconnect();
  }
};
