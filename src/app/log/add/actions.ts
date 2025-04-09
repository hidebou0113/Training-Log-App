import { MenuType } from "@/types";

export async function fetchMenus(): Promise<MenuType[]> {
  try {
    const res = await fetch(`http://localhost:3000/api/menus`, {
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error("メニュー取得失敗");
    }
    const data = await res.json();

    if (Array.isArray(data)) {
      return data;
    } else if (Array.isArray(data.menus)) {
      return data.menus;
    } else {
      console.error("Unexpected data structure:", data);
      return [];
    }
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function createLog(
  userId: string,
  menuId: number,
  weight: number,
  reps: number,
  sets: number
) {
  const res = await fetch(`http://localhost:3000/api/log`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
      menuId: Number(menuId),
      weight: Number(weight),
      reps: Number(reps),
      sets: Number(sets),
    }),
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText);
  }
  return res.json();
}
