import { createRoute, v } from "@kalena/framework";
import { isAdminOfServer } from "@permissions/index.ts";
import { createEvents } from "@comp/utils/events.ts";

/**
 * Handler for adding a resource cost to an action
 * Note: This is a placeholder until actionResourceCost schema is created
 */
const AddResourceCostToAction = () => {
  const context = addResourceCostToActionRoute.context();
  const result = context.req.valid("form");

  console.log("Adding resource cost to action");
  console.log("Form data:", result.output);

  // Return success response
  context.header(
    "HX-Trigger",
    createEvents([
      { name: "dialog-close", values: { value: true } },
      {
        name: "toast-show",
        values: {
          message: "Resource cost added successfully",
          variant: "success",
          title: "Success",
        },
      },
    ]),
  );

  return (
    <div id="modify-resource-cost-of-action-form" hx-swap-oob="true">
    </div>
  );
};

const formSchema = v.object({
  resourceId: v.pipe(v.string(), v.uuid()),
  quantity: v.pipe(
    v.string(),
    v.transform((value: string) => Number(value)),
    v.number(),
    v.integer(),
    v.minValue(1),
  ),
});

export const addResourceCostToActionRoute = createRoute({
  path: "/servers/:serverId/admin/actions/:actionId/costs",
  component: AddResourceCostToAction,
  formValidationSchema: formSchema,
  permission: {
    check: isAdminOfServer,
    redirectPath: "/servers",
  },
  partial: true,
  hmr: Deno.env.get("ENV") === "local",
});
