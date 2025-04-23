import { NextResponse } from "next/server";
import prisma, { connectDB } from "@/app/lib/prisma";

export const GET = async () => {
  try {
    await connectDB();
    const menus = await prisma.menu.findMany();
    return NextResponse.json({ message: "Success", menus }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  }
};
