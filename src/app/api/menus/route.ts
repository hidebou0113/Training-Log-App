import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/prisma";

const prisma = new PrismaClient();

export const GET = async () => {
  try {
    await connectDB();
    const menus = await prisma.menu.findMany();
    return NextResponse.json({ message: "Success", menus }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};
