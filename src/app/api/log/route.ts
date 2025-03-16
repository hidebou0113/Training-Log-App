import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function main() {
  try {
    await prisma.$connect();
  } catch (err) {
    return Error("DB接続に失敗");
  }
}

//筋トレ全記録取得API
export const GET = async (req: Request) => {
  try {
    await main();
    const posts = await prisma.post.findMany({
      include: {
        menu: true,
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
    const { menuId, weight, reps, sets, date } = await req.json();

    await main();
    const post = await prisma.post.create({
      data: { menuId, weight, reps, sets, date },
    });
    return NextResponse.json({ message: "Success", post }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};
