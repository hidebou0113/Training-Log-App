"use client";

import { MenuType } from "@/types";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useRef } from "react";
import { createLog } from "./actions";
import { Button } from "@mui/material";
import { Controller, useFieldArray, useForm } from "react-hook-form";

type LogEntry = {
  menuId: number | "";
  weight: number;
  reps: number;
  sets: number;
};

type EditLogFormProps = {
  initialMenu: MenuType[];
};

const PostLogForm = ({ initialMenu }: EditLogFormProps) => {
  const router = useRouter();
  const { data: session } = useSession();

  const { control, handleSubmit, reset } = useForm<{ logs: LogEntry[] }>({
    defaultValues: {
      logs: [{ menuId: "", weight: 0, reps: 0, sets: 0 }],
    },
  });

  const { fields, append } = useFieldArray({
    control,
    name: "logs",
  });

  const onSubmit = async (data: { logs: LogEntry[] }) => {
    const userId = (session?.user as { id: string }).id;
    if (!userId) {
      console.error("ユーザーが認証されてません");
      return;
    }
    try {
      for (const log of data.logs) {
        if (log.menuId === "") {
          alert("筋トレメニューを選択してください");
          return;
        }

        await createLog(
          userId,
          Number(log.menuId),
          log.weight,
          log.reps,
          log.sets
        );
      }
      reset();
      router.push("/");
    } catch (error) {
      console.error("ログ投稿エラー", error);
    }
  };

  return (
    <>
      <div className="w-full m-auto flex flex-col my-4">
        <div className="flex flex-col justify-center items-center m-auto">
          <p className="text-3xl text-black-300 font-bold p-5">筋トレ記録 💪</p>
          <form onSubmit={handleSubmit(onSubmit)}>
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="border border-gray-300 p-4 rounded mb-4 flex flex-row gap-4 items-center"
              >
                {/* 筋トレメニュー */}
                <div className="flex flex-col">
                  <Controller
                    name={`logs.${index}.menuId` as const}
                    control={control}
                    rules={{ required: "筋トレメニューは必須です" }}
                    render={({ field }) => (
                      <select
                        id={`logs.${index}.menuId`}
                        {...field}
                        className="w-full p-3 border rounded"
                      >
                        <option value="" disabled>
                          メニューを選択
                        </option>
                        {initialMenu.map((menu: MenuType) => (
                          <option key={menu.id} value={menu.id}>
                            {menu.name}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                </div>

                <div className="flex flex-col">
                  <Controller
                    name={`logs.${index}.weight` as const}
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        value={field.value === 0 ? "" : field.value}
                        id="weight"
                        type="number"
                        placeholder="重量を入力"
                        className="w-full p-3 border rounded"
                      />
                    )}
                  />
                </div>

                <div className="flex flex-col">
                  <Controller
                    name={`logs.${index}.reps` as const}
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        value={field.value === 0 ? "" : field.value}
                        id="reps"
                        type="number"
                        placeholder="回数を入力"
                        className="w-full p-3 border rounded"
                      />
                    )}
                  />
                </div>

                <div className="flex flex-col">
                  <Controller
                    name={`logs.${index}.sets` as const}
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        value={field.value === 0 ? "" : field.value}
                        id="sets"
                        type="number"
                        placeholder="セット数を入力"
                        className="w-full p-3 border rounded"
                      />
                    )}
                  />
                </div>
              </div>
            ))}
            <div className="mb-4 text-center">
              <button
                type="button"
                className="font-semibold px-4 py-2 shadow-xl bg-blue-200 rounded-lg m-auto hover:bg-blue-300"
                onClick={() => {
                  if (fields.length < 5) {
                    append({ menuId: "", weight: 0, reps: 0, sets: 0 });
                  } else {
                    alert("最大5件まで追加可能です");
                  }
                }}
              >
                さらに追加
              </button>
            </div>

            <div className="text-center">
              <Button
                type="submit"
                variant="contained"
                sx={{
                  width: { xs: "20%", md: "25%" },
                  height: { xs: "60%" },
                  p: 2,
                  backgroundColor: "success.main",
                  fontWeight: "bold",
                  fontSize: "1.0rem",
                }}
              >
                記録
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default PostLogForm;
