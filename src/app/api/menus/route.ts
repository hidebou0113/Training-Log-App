import { PrismaClient } from "@prisma/client";
import { main } from "../log/route";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export const GET = async () => {
  try {
    await main();
    const menus = await prisma.menu.findMany();
    return NextResponse.json({ message: "Success", menus }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};
