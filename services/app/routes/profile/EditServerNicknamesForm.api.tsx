import { EditServerNicknamesForm } from "./EditServerNicknamesForm.section.tsx";
import { createRoute, getGlobalContext } from "@kalena/framework";
import { getAccountWithUsers } from "@queries/account/getAccountWithUsers.ts";
import { throwError } from "@package/common";
import { isLoggedIn } from "@permissions/index.ts";

const EditNicknamesHandler = async () => {
  const context = getGlobalContext();
  const email = context.var.email ?? throwError("Email not found");

  const { userServers } = await getAccountWithUsers(email);

  return <EditServerNicknamesForm userServers={userServers} />;
};

export const editServerNicknamesFormRoute = createRoute({
  path: "/api/profile/edit-server-nicknames-form",
  component: EditNicknamesHandler,
  permission: {
    check: isLoggedIn,
    redirectPath: "/",
  },
  partial: true,
  hmr: Deno.env.get("ENV") === "local",
});
