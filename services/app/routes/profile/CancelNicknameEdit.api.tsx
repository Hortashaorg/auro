import { DefaultNicknameFlex } from "./DefaultNicknameFlex.section.tsx";
import { createRoute } from "@kalena/framework";
import { isLoggedIn } from "@permissions/index.ts";

const CancelNicknameEdit = () => {
  return <DefaultNicknameFlex />;
};

export const cancelNicknameEditRoute = createRoute({
  path: "/api/profile/cancel-nickname-edit",
  component: CancelNicknameEdit,
  permission: {
    check: isLoggedIn,
    redirectPath: "/",
  },
  partial: true,
  hmr: Deno.env.get("ENV") === "local",
});
