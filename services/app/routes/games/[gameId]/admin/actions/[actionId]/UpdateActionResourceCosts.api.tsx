import { isAdminOfGame } from "@permissions/index.ts";
import { createRoute } from "@kalena/framework";
import { createEvents } from "@comp/utils/events.ts";
import { updateActionResourceCosts } from "@queries/mutations/actions/updateActionResourceCosts.ts";
import { ModifyResourceCostOfActionForm } from "./ModifyResourceCostOfActionForm.section.tsx";
import { selectResourceCostsByActionId } from "@queries/selects/actions/selectResourceCostsByActionId.ts";

const UpdateActionResourceCosts = async () => {
  const context = updateActionResourceCostsRoute.context();
  const actionId = context.req.param("actionId");

  console.log("Updating action resource costs");

  try {
    // Get all form entries - no validation needed since we're just parsing fields
    const entries = await context.req.raw.formData();
    const resourceQuantities: Record<string, number> = {};
    for (const [key, value] of entries.entries()) {
      if (key.startsWith("resource_") && key.endsWith("_quantity")) {
        const resourceId = key.replace("resource_", "").replace(
          "_quantity",
          "",
        );
        const quantity = parseInt(value.toString(), 10);
        if (!isNaN(quantity)) {
          resourceQuantities[resourceId] = quantity;
        }
      }
    }

    const costs = await selectResourceCostsByActionId(actionId);

    const updates = costs
      .map((cost) => {
        const newQuantity = resourceQuantities[cost.resourceId];
        if (typeof newQuantity === "number" && newQuantity > 0) {
          return { id: cost.id, updates: { quantity: newQuantity } };
        }
        return null;
      })
      .filter(Boolean) as { id: string; updates: { quantity: number } }[];

    if (updates.length > 0) {
      await updateActionResourceCosts(updates);
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
