"use client";

import { MenuType } from "@/types";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

const editLog = async (
  menuId: number,
  weight: number,
  reps: number,
  sets: number,
  id: number
) => {
  const res = await fetch(`http://localhost:3000/api/log/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ menuId, weight, reps, sets, id }),
  });

  return res.json();
};

const getLogById = async (id: number) => {
  const res = await fetch(`http://localhost:3000/api/log/${id}`);
  const data = await res.json();
  return data.post;
};

const deleteLog = async (id: number) => {
  const res = await fetch(`http://localhost:3000/api/log/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return res.json();
};

const EditLog = ({ params }: { params: { id: number } }) => {
  const router = useRouter();
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

    await editLog(
      menuRef.current?.value ? Number(menuRef.current.value) : 0,
      weightRef.current?.value ? Number(weightRef.current.value) : 0,
      repsRef.current?.value ? Number(repsRef.current.value) : 0,
      setsRef.current?.value ? Number(setsRef.current.value) : 0,
      params.id
    );

    router.push("/");
    router.refresh();
  };

  const handleDelete = async () => {
    await deleteLog(params.id);

    router.push("/");
    router.refresh();
  };

  useEffect(() => {
    getLogById(params.id)
      .then((data) => {
        menuRef.current!.value = data.menu;
        weightRef.current!.value = data.weight;
        repsRef.current!.value = data.reps;
        setsRef.current!.value = data.sets;
      })
      .catch((err) => {
        console.log(err);
      });
  }, [params.id]);

  return (
    <>
      <div className="w-full m-auto flex my-4">
        <div className="flex flex-col justify-center items-center m-auto">
          <p className="text-2xl text-slate-200 font-bold p-3">
            筋トレ記録の編集 💪
          </p>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
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

            <div className="mb-4">
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

            <div className="mb-4">
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

            <div className="mb-4">
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

            <button className="font-semibold px-4 py-2 shadow-xl bg-slate-200 rounded-lg m-auto hover:bg-slate-100">
              更新
            </button>
            <button
              onClick={handleDelete}
              className="ml-2 font-semibold px-4 py-2 shadow-xl bg-red-400 rounded-lg m-auto hover:bg-slate-100"
            >
              削除
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditLog;
