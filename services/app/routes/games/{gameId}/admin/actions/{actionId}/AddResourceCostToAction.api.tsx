import { createRoute, v } from "@kalena/framework";
import { isAdminOfGame } from "@permissions/index.ts";
import { createEvents } from "@comp/utils/events.ts";
import { catchConstraintByName, queries } from "@package/database";
import { ModifyResourceCostOfActionForm } from "./ModifyResourceCostOfActionForm.section.tsx";

const AddResourceCostToAction = async () => {
  const context = addResourceCostToActionRoute.context();
  const result = context.req.valid("form");
  const actionId = context.req.param("actionId");

  try {
    const formData = result.output as {
      resourceId: string;
    };

    await queries.actions.setActionResourceCost({
      actionId,
      resourceId: formData.resourceId,
      quantity: 1,
    });

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

    return <ModifyResourceCostOfActionForm hx-swap-oob="true" />;
  } catch (error) {
    if (catchConstraintByName(error, "unique_action_resource_cost")) {
      context.header(
        "HX-Trigger",
        createEvents([{
          name: "form-error",
          values: {
            resourceId: "This resource is already a cost for this action",
          },
        }]),
      );
      context.status(400);
      return <p>Failed to add resource cost</p>;
    }
    throw error;
  }
};

const formSchema = v.object({
  resourceId: v.pipe(v.string(), v.uuid()),
});

export const addResourceCostToActionRoute = createRoute({
  path: "/games/:gameId/admin/actions/:actionId/costs",
  component: AddResourceCostToAction,
  formValidationSchema: formSchema,
  permission: {
    check: isAdminOfGame,
    redirectPath: "/games",
  },
  partial: true,
  hmr: Deno.env.get("ENV") === "local",
});
