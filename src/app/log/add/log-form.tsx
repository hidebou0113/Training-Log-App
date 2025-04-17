"use client";

import { MenuType, PostLogFormValues } from "@/types";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import { createLog } from "./actions";
import { Button } from "@mui/material";
import { Control, useFieldArray, useForm } from "react-hook-form";
import LogFormFields from "@/app/components/LogFormFields";

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

  const { control, handleSubmit, reset } = useForm<PostLogFormValues>({
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
                <LogFormFields
                  control={control as unknown as Control<LogEntry>}
                  index={index}
                  initialMenu={initialMenu}
                  isMultipleForm={true}
                />
              </div>
            ))}
            <div className="mb-4 flex">
              <Button
                onClick={() => {
                  if (fields.length < 5) {
                    append({ menuId: "", weight: 0, reps: 0, sets: 0 });
                  } else {
                    alert("最大5件まで追加可能です");
                  }
                }}
                variant="contained"
                sx={{ ml: "auto", mr: 2 }}
              >
                さらに追加
              </Button>
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
