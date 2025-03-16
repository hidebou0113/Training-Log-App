export type PostType = {
  id: number;
  menuId: number;
  weight: number;
  reps: number;
  sets: number;
  date: Date;
  menu: {
    id: number;
    name: string;
  };
};

export type MenuType = {
  id: number;
  name: string;
};
