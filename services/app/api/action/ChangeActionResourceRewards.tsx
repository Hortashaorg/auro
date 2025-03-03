import { createRoute, v } from "@kalena/framework";
import { isAdminOfServer } from "@permissions/index.ts";

const ChangeActionResourceRewards = () => {
  const formData = changeActionResourceRewardsRoute.context().req.valid("form");

  console.log(formData);
  return <p>yolo</p>;
};

const inputSchema = v.object({
  change: v.string(),
  quantityMin: v.string(),
  quantityMax: v.string(),
});

export const changeActionResourceRewardsRoute = createRoute({
  path: "/api/servers/:serverId/actions/:actionId/resource-rewards/change",
  component: ChangeActionResourceRewards,
  partial: true,
  permission: {
    check: isAdminOfServer,
    redirectPath: "/servers",
  },
  formValidationSchema: inputSchema,
  hmr: Deno.env.get("ENV") === "local",
});
