import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = new PrismaClient();
}

export async function connectDB() {
  try {
    await prisma.$connect();
  } catch (err) {
    console.error("DB接続エラー:", err);
    throw new Error("DB接続に失敗しました");
  }
}

const prisma = globalForPrisma.prisma;

export default prisma;
