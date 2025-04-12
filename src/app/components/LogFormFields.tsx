import { EditLogFormValues, LogEntry, MenuType } from "@/types";
import { Control, Controller } from "react-hook-form";

type LogFormFieldsProps = {
  control: Control<LogEntry>;
  index?: number;
  initialMenu: MenuType[];
  isMultipleForm?: boolean;
};

const LogFormFields = ({
  control,
  index = 0,
  initialMenu,
  isMultipleForm = false,
}: LogFormFieldsProps) => {
  const getFieldName = (field: string): string => {
    return isMultipleForm ? `logs.${index}.${field}` : field;
  };

  return (
    <div
      className={
        isMultipleForm
          ? "border-gray-300 p-4 rounded mb-4 flex flex-row gap-4 items-center"
          : ""
      }
    >
      {/* 筋トレメニュー */}
      <div className={isMultipleForm ? "flex flex-col" : ""}>
        <Controller
          name={getFieldName("menuId") as keyof EditLogFormValues}
          control={control}
          rules={{ required: "筋トレメニューは必須です" }}
          render={({ field }) => (
            <select
              id={getFieldName("menuId")}
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

      <div className={isMultipleForm ? "flex flex-col" : ""}>
        <Controller
          name={getFieldName("weight") as keyof EditLogFormValues}
          control={control}
          render={({ field }) => (
            <input
              {...field}
              value={field.value === 0 ? "" : field.value}
              id={getFieldName("weight")}
              type="number"
              placeholder="重量を入力"
              className="w-full p-3 border rounded"
            />
          )}
        />
      </div>

      <div className={isMultipleForm ? "flex flex-col" : ""}>
        <Controller
          name={getFieldName("reps") as keyof EditLogFormValues}
          control={control}
          render={({ field }) => (
            <input
              {...field}
              value={field.value === 0 ? "" : field.value}
              id={getFieldName("reps")}
              type="number"
              placeholder="回数を入力"
              className="w-full p-3 border rounded"
            />
          )}
        />
      </div>

      <div className={isMultipleForm ? "flex flex-col" : ""}>
        <Controller
          name={getFieldName("sets") as keyof EditLogFormValues}
          control={control}
          render={({ field }) => (
            <input
              {...field}
              value={field.value === 0 ? "" : field.value}
              id={getFieldName("sets")}
              type="number"
              placeholder="セット数を入力"
              className="w-full p-3 border rounded"
            />
          )}
        />
      </div>
    </div>
  );
};

export default LogFormFields;
