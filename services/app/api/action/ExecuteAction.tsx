import { createRoute } from "@kalena/framework";
import { isPlayerOfServer } from "@permissions/index.ts";

const ExecuteAction = () => {
  console.log("hello world");
  // Data:
  // Action
  // Resources on action
  // Calculate odds + amount
  // Populate resource on player
  // Rerender UI that shows resources
  return <p>hello world</p>;
};

export const executeActionRoute = createRoute({
  path: "/api/servers/:serverId/actions/:actionId/execute",
  component: ExecuteAction,
  permission: {
    check: isPlayerOfServer,
    redirectPath: "/servers",
  },
  partial: false,
  hmr: Deno.env.get("ENV") === "local",
});
