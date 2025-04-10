import { nextAuthOptions } from "@/app/lib/next-auth/options";
import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import EditLogForm from "./EditLogForm";
import { fetchMenus } from "@/app/lib/fetchMenus";

type Props = {
  params: {
    id: string;
  };
};

export default async function EditLogPage({ params }: Props) {
  const id = Number(params.id);

  const session = await getServerSession(nextAuthOptions);
  if (!session) {
    redirect("/api/auth/signin");
  }

  const [menus, data] = await Promise.all([
    fetchMenus(),
    prisma.post.findUnique({
      where: { id },
      include: { menu: true, user: true },
    }),
  ]);

  if (!data) {
    redirect("/");
  }

  if (session.user.id !== data.userId.toString()) {
    redirect("/");
  }
  return <EditLogForm initialMenu={menus} initialLogData={data} />;
}
