import { ServerNicknamesTable } from "./ServerNicknamesTable.section.tsx";
import { createRoute } from "@kalena/framework";
import { isLoggedIn } from "@permissions/index.ts";

const CancelHandler = () => {
  return <ServerNicknamesTable />;
};

export const cancelEditServerNicknamesRoute = createRoute({
  path: "/api/profile/cancel-edit-server-nicknames",
  component: CancelHandler,
  permission: {
    check: isLoggedIn,
    redirectPath: "/",
  },
  partial: true,
  hmr: Deno.env.get("ENV") === "local",
});
