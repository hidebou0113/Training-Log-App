export type PostType = {
  id: number;
  menuId: number;
  weight: number;
  reps: number;
  sets: number;
  date: Date;
  userId: string;
  user: {
    name: string;
    id: string;
  };
  menu: {
    id: number;
    name: string;
    email?: string;
  };
};

export type MenuType = {
  id: number;
  name: string;
};

export type Credentials = {
  email: string;
  password: string;
};
