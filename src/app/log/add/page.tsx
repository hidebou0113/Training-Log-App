"use client";
import { MenuType } from "@/types";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

const postLog = async (
  menuId: number,
  weight: number,
  reps: number,
  sets: number,
  userId: string
) => {
  const res = await fetch(`http://localhost:3000/api/log`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, menuId, weight, reps, sets }),
  });

  return res.json();
};

const PostLog = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const menuRef = useRef<HTMLSelectElement | null>(null);
  const [menus, setMenus] = useState<MenuType[]>([]);
  const weightRef = useRef<HTMLInputElement | null>(null);
  const repsRef = useRef<HTMLInputElement | null>(null);
  const setsRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    async function fetchMenus() {
      try {
        const res = await fetch(`http://localhost:3000/api/menus`, {
          cache: "no-store",
        });
        if (!res.ok) {
          throw new Error("メニュー取得失敗");
        }
        const data = await res.json();
        console.log("Fetched data:", data);
        if (Array.isArray(data)) {
          setMenus(data);
        } else if (Array.isArray(data.menus)) {
          setMenus(data.menus);
        } else {
          console.error("Unexpected data structure:", data);
          setMenus([]);
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchMenus();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const userId = (session?.user as { id: string }).id;
    if (!userId) {
      console.error("ユーザーが認証されていません");
      return;
    }

    await postLog(
      menuRef.current?.value ? Number(menuRef.current.value) : 0,
      weightRef.current?.value ? Number(weightRef.current.value) : 0,
      repsRef.current?.value ? Number(repsRef.current.value) : 0,
      setsRef.current?.value ? Number(setsRef.current.value) : 0,
      userId
    );

    router.push("/");
    // router.refresh();
  };

  return (
    <>
      <div className="w-full m-auto flex flex-col my-4">
        <div className="flex flex-col justify-center items-center m-auto">
          <p className="text-3xl text-black-300 font-bold p-5">筋トレ記録 💪</p>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-row gap-4 mb-4">
              <div className="mb-4 flex flex-col">
                <label
                  htmlFor="menu"
                  className="block text-lg font-medium text-gray-700 mb-1"
                >
                  筋トレメニュー
                </label>
                <select id="menu" ref={menuRef} defaultValue="">
                  <option value="" disabled>
                    メニューを選択
                  </option>
                  {menus.map((menu: MenuType) => (
                    <option key={menu.id} value={menu.id}>
                      {menu.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4 flex flex-col">
                <label
                  htmlFor="weight"
                  className="block text-lg font-medium text-gray-700 mb-1"
                >
                  重量(kg)
                </label>
                <input
                  id="weight"
                  type="number"
                  placeholder="重量を入力"
                  className="w-full  p-3 border rounded"
                  ref={weightRef}
                />
              </div>

              <div className="mb-4 flex flex-col">
                <label
                  htmlFor="reps"
                  className="block text-lg font-medium text-gray-700 mb-1"
                >
                  回数
                </label>
                <input
                  id="reps"
                  type="number"
                  placeholder="回数を入力"
                  className="w-full p-3 border rounded"
                  ref={repsRef}
                />
              </div>

              <div className="mb-4 flex flex-col">
                <label
                  htmlFor="sets"
                  className="block text-lg font-medium text-gray-700 mb-1"
                >
                  セット数
                </label>
                <input
                  id="sets"
                  type="number"
                  placeholder="セット数を入力"
                  className="w-full p-3 border rounded"
                  ref={setsRef}
                />
              </div>
            </div>

            <div className="mb-4 text-center">
              <button
                type="button"
                className="font-semibold px-4 py-2 shadow-xl bg-blue-200 rounded-lg m-auto hover:bg-blue-300"
              >
                さらに追加
              </button>
            </div>

            <div className="text-center">
              <button className="font-semibold px-4 py-2 shadow-xl bg-slate-200 rounded-lg m-auto hover:bg-slate-100">
                記録
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default PostLog;
