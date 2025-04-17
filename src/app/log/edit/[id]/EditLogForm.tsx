"use client";

import LogFormFields from "@/app/components/LogFormFields";
import { EditLogFormProps, LogEntry } from "@/types";
import { Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export default function EditLogForm({
  initialMenu,
  initialLogData,
}: EditLogFormProps) {
  const router = useRouter();

  const { control, handleSubmit } = useForm<LogEntry>({
    defaultValues: {
      menuId: initialLogData.menu?.id || 0,
      weight: initialLogData?.weight || 0,
      reps: initialLogData?.reps || 0,
      sets: initialLogData?.sets || 0,
    },
  });

  const onSubmit = async (formData: LogEntry) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/log/${initialLogData.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: initialLogData.id,
            menuId: Number(formData.menuId),
            weight: Number(formData.weight),
            reps: Number(formData.reps),
            sets: Number(formData.sets),
          }),
        }
      );
      if (!res.ok) {
        const errorText = await res.text();
        console.error("エラーレスポンス:", errorText);
        throw new Error("ログ更新に失敗しました");
      }
      router.push("/");
    } catch (error) {
      console.error("更新エラー", error);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/log/${initialLogData.id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!res.ok) {
        throw new Error("ログ削除に失敗しました");
      }
      router.push("/");
    } catch (error) {
      console.error("削除エラーー", error);
    }
  };

  return (
    <div
      className="w-full max-w-2xl mx-auto my-6 p-6 rounded-2xl shadow-lg"
      style={{ backgroundColor: "#b3e5fc" }}
    >
      <div className="flex flex-col justify-center items-center m-auto">
        <h2 className="text-4xl text-white-200 font-bold  p-1">
          筋トレ記録の編集 💪
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <LogFormFields
            control={control}
            initialMenu={initialMenu}
            isMultipleForm={false}
          />
          <div className="flex justify-center mt-3">
            <Button
              variant="outlined"
              type="submit"
              color="success"
              sx={{ mx: 1, fontWeight: "bold" }}
            >
              更新
            </Button>

            <Button
              variant="outlined"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
              color="error"
              sx={{ mx: 1, fontWeight: "bold" }}
            >
              削除
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
