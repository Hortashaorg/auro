import { createRoute } from "@kalena/framework";
import { isPlayerOfServer } from "@permissions/index.ts";
import { TimeUntilNextActionText } from "./TimeUntilNextActionText.section.tsx";
import { throwError } from "@package/common";
import { serverAndUser } from "@queries/user/serverAndUser.ts";

const Handler = async () => {
  const context = timeUntilNextActionRoute.context();
  const serverId = context.req.param("serverId") ??
    throwError("Server ID not found in route params");
  const email = context.var.email ?? throwError("Email not found");

  const { user, server } = await serverAndUser(serverId, email);

  return <TimeUntilNextActionText server={server} user={user} />;
};

export const timeUntilNextActionRoute = createRoute({
  path: "/api/servers/:serverId/actions/time-until-next-action",
  component: Handler,
  permission: {
    check: isPlayerOfServer,
    redirectPath: "/",
  },
  partial: true,
  hmr: Deno.env.get("ENV") === "local",
});
