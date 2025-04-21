import { isAdminOfGame } from "@permissions/index.ts";
import { createRoute } from "@kalena/framework";
import { createEvents } from "@comp/utils/events.ts";
import { db, eq, schema } from "@package/database";
import { ModifyResourceCostOfActionForm } from "./ModifyResourceCostOfActionForm.section.tsx";

const UpdateActionResourceCosts = async () => {
  const context = updateActionResourceCostsRoute.context();
  const actionId = context.req.param("actionId");

  console.log("Updating action resource costs");

  try {
    // Get all form entries - no validation needed since we're just parsing fields
    const entries = await context.req.raw.formData();
    console.log("Form entries:", Object.fromEntries(entries));

    // First, fetch all costs for this action
    const costs = await db.select({
      id: schema.actionResourceCost.id,
      resourceId: schema.actionResourceCost.resourceId,
    })
      .from(schema.actionResourceCost)
      .where(eq(schema.actionResourceCost.actionId, actionId));

    await db.transaction(async (tx) => {
      for (const cost of costs) {
        const quantityKey = `resource_${cost.resourceId}_quantity`;
        const quantityValue = entries.get(quantityKey);

        if (quantityValue) {
          const newQuantity = parseInt(quantityValue.toString(), 10);

          if (!isNaN(newQuantity) && newQuantity > 0) {
            await tx.update(schema.actionResourceCost)
              .set({ quantity: newQuantity })
              .where(eq(schema.actionResourceCost.id, cost.id));
          }
        }
      }
    });

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
