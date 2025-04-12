export const dynamic = "force-dynamic";

import { fetchMenus } from "./actions";
import PostLogForm from "./log-form";

export default async function AddLogPage() {
  const menus = await fetchMenus();

  return <PostLogForm initialMenu={menus} />;
}
