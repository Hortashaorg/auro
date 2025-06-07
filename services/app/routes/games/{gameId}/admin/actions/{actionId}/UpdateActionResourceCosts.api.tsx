import { isAdminOfGame } from "@permissions/index.ts";
import { createRoute } from "@kalena/framework";
import { createEvents } from "@comp/utils/events.ts";
import { ModifyResourceCostOfActionForm } from "./ModifyResourceCostOfActionForm.section.tsx";
import { queries } from "@package/database";

const UpdateActionResourceCosts = async () => {
  const context = updateActionResourceCostsRoute.context();
  const actionId = context.req.param("actionId");

  console.log("Updating action resource costs");

  try {
    // Get all form entries - no validation needed since we're just parsing fields
    const entries = await context.req.raw.formData();
    const inputQuantities: {
      resourceId: string;
      actionId: string;
      quantity: number;
    }[] = [];
    for (const [key, value] of entries.entries()) {
      if (key.startsWith("resource_") && key.endsWith("_quantity")) {
        const resourceId = key.replace("resource_", "").replace(
          "_quantity",
          "",
        );
        const quantity = parseInt(value.toString(), 10);
        if (!isNaN(quantity)) {
          inputQuantities.push({
            actionId: actionId,
            resourceId: resourceId,
            quantity: quantity,
          });
        }
      }
    }

    const costs = await queries.actions.getResourceCostsByActionId(actionId);

    const updates = inputQuantities.filter((q) => {
      const previousCost = costs.find((c) =>
        c.action_resource_cost.actionId === q.actionId &&
        c.action_resource_cost.resourceId === q.resourceId
      );

      return previousCost?.action_resource_cost.quantity !== q.quantity;
    });

    if (updates.length > 0) {
      await queries.actions.setActionResourceCosts(updates);
    }

    context.header(
      "HX-Trigger",
      createEvents([
        {
          name: "toast-show",
          values: {
            message: "Resource costs updated successfully",
            variant: "success",
            title: "Success",
          },
        },
      ]),
    );

    return <ModifyResourceCostOfActionForm hx-swap-oob="true" />;
  } catch (error) {
    console.error("Error updating resource costs:", error);

    context.header(
      "HX-Trigger",
      createEvents([
        {
          name: "toast-show",
          values: {
            message: "Failed to update resource costs",
            variant: "danger",
            title: "Error",
          },
        },
      ]),
    );
    context.status(500);
    return <p>Error updating resource costs</p>;
  }
};

export const updateActionResourceCostsRoute = createRoute({
  path: "/games/:gameId/admin/actions/:actionId/update-costs",
  component: UpdateActionResourceCosts,
  permission: {
    check: isAdminOfGame,
    redirectPath: "/games",
  },
  partial: true,
  hmr: Deno.env.get("ENV") === "local",
});
