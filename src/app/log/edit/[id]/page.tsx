import { nextAuthOptions } from "@/app/lib/next-auth/options";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import EditLogForm from "./EditLogForm";
import { PostType } from "@/types";

const prisma = new PrismaClient();

async function fetchMenus() {
  try {
    const menus = await prisma.menu.findMany({
      orderBy: { name: "asc" },
    });
    return menus;
  } catch (error) {
    console.error("メニュー取得エラー", error);
    throw new Error("筋トレメニューの取得に失敗しました");
  }
}

async function fetchLogById(id: number): Promise<PostType> {
  try {
    const log = await prisma.post.findUnique({
      where: { id },
      include: { menu: true, user: true },
    });
    if (!log) {
      throw new Error("記録が見つかりません");
    }
    return log;
  } catch (error) {
    console.error("ログ取得エラー", error);
    throw new Error("筋トレ記録の取得に失敗しました");
  }
}

export default async function EditLogPage({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);

  const session = await getServerSession(nextAuthOptions);
  if (!session) {
    redirect("/api/auth/signin");
  }

  const [menus, data] = await Promise.all([
    fetchMenus(),
    fetchLogById(Number(params.id)),
  ]);

  if (session.user.id !== data.userId) {
    redirect("/");
  }
  return <EditLogForm initialMenu={menus} initialLogData={data} />;
}
