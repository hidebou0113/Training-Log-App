import prisma from "./prisma";

export async function fetchMenus() {
  try {
    return await prisma.menu.findMany({ orderBy: { name: "asc" } });
  } catch (error) {
    console.error("メニュー取得エラー", error);
    throw new Error("筋トレメニューの取得に失敗しました");
  }
}
