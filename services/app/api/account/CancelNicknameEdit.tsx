import { DefaultNicknameDisplay } from "@sections/views/DefaultNicknameDisplay.tsx";
import { createRoute } from "@kalena/framework";
import { isLoggedIn } from "@permissions/index.ts";

const CancelNicknameEdit = () => {
  return <DefaultNicknameDisplay />;
};

export const cancelNicknameEditRoute = createRoute({
  path: "/api/account/cancel-nickname-edit",
  component: CancelNicknameEdit,
  permission: {
    check: isLoggedIn,
    redirectPath: "/",
  },
  partial: true,
  hmr: Deno.env.get("ENV") === "local",
});
