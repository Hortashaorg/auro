import { isAdminOfServer } from "@permissions/index.ts";
import { createRoute } from "@kalena/framework";
import { createEvents } from "@comp/utils/events.ts";
import { db, eq, schema } from "@package/database";
import { ModifyResourceCostOfActionForm } from "./ModifyResourceCostOfActionForm.section.tsx";

const RemoveResourceCost = async () => {
  const context = removeResourceCostRoute.context();
  const costId = context.req.param("costId");

  try {
    await db.delete(schema.actionResourceCost)
      .where(eq(schema.actionResourceCost.id, costId));

    context.header(
      "HX-Trigger",
      createEvents([
        {
          name: "toast-show",
          values: {
            message: "Resource cost removed successfully",
            variant: "success",
            title: "Success",
          },
        },
      ]),
    );

    return <ModifyResourceCostOfActionForm hx-swap-oob="true" />;
  } catch (error) {
    console.error("Error removing resource cost:", error);

    context.header(
      "HX-Trigger",
      createEvents([
        {
          name: "toast-show",
          values: {
            message: "Failed to remove resource cost",
            variant: "danger",
            title: "Error",
          },
        },
      ]),
    );
    context.status(500);
    return <p>Error removing resource cost</p>;
  }
};

export const removeResourceCostRoute = createRoute({
  path: "/servers/:serverId/admin/actions/:actionId/remove-cost/:costId",
  component: RemoveResourceCost,
  permission: {
    check: isAdminOfServer,
    redirectPath: "/servers",
  },
  partial: true,
  hmr: Deno.env.get("ENV") === "local",
});
