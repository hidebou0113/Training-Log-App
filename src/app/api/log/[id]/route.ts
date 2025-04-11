import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { connectDB } from "@/app/lib/prisma";

const prisma = new PrismaClient();

//筋トレ詳細記録取得API
export const GET = async (req: Request) => {
  try {
    const id: number = parseInt(req.url.split("/log/")[1]);
    await connectDB();
    const post = await prisma.post.findFirst({ where: { id } });
    return NextResponse.json({ message: "Success", post }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};

//筋トレ記録編集API
export const PUT = async (
  req: Request,
  context: { params: Promise<{ id: string }> }
) => {
  try {
    const { params } = context;
    const { id } = await params;

    const { menuId, weight, reps, sets } = await req.json();

    const post = await prisma.post.update({
      data: { menuId, weight, reps, sets },
      where: { id: Number(id) },
    });
    return NextResponse.json({ message: "Success", post }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  }
};

//筋トレ記録削除API
export const DELETE = async (req: Request) => {
  try {
    const id: number = parseInt(req.url.split("/log/")[1]);

    await main();
    const post = await prisma.post.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Success", post }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  }
};
