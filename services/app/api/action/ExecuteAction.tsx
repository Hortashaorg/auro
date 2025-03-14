import { createRoute } from "@kalena/framework";
import { isPlayerOfServer } from "@permissions/index.ts";

const DoAction = () => {
  console.log("hello world");
  return <p>hello world</p>;
};

export const doActionRoute = createRoute({
  path: "/api/servers/:serverId/actions/:actionId/execute",
  component: DoAction,
  permission: {
    check: isPlayerOfServer,
    redirectPath: "/servers",
  },
  partial: false,
  hmr: Deno.env.get("ENV") === "local",
});
