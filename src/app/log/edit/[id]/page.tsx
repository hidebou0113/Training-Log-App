import { nextAuthOptions } from "@/app/lib/next-auth/options";
import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import EditLogForm from "./EditLogForm";
import { fetchMenus } from "@/app/lib/fetchMenus";

export default async function EditLogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const id = Number(resolvedParams.id);

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
