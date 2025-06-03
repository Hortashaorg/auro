import { isAdminOfGame } from "@permissions/index.ts";
import { createRoute, v } from "@kalena/framework";
import { throwError } from "@package/common";
import { createEvents } from "@comp/utils/events.ts";
import { catchConstraintByName, queries } from "@package/database";
import { ModifyResourceOfActionForm } from "./ModifyResourceOfActionForm.section.tsx";

const AddActionResourceRewards = async () => {
  const context = addActionResourceRewardsRoute.context();
  const result = addActionResourceRewardsRoute.context().req.valid("form");

  if (!result.success) {
    const errorEvents: Record<string, string> = {};
    for (const issue of result.issues) {
      const field: string = issue.path?.[0]?.key as string ??
        throwError("Invalid issue path");
      errorEvents[field] = issue.message;
    }

    context.header(
      "HX-Trigger",
      createEvents([
        {
          name: "form-error",
          values: errorEvents,
        },
      ]),
    );
    return <p>Invalid form data</p>;
  }

  const actionId = context.req.param("actionId");

  try {
    await queries.actions.setActionResourceReward({
      actionId,
      resourceId: result.output.resourceId,
      quantityMin: 1,
      quantityMax: 1,
      chance: 100,
    });

    context.header(
      "HX-Trigger",
      createEvents([
        { name: "dialog-close", values: { value: true } },
        { name: "form-clear", values: { value: true } },
        {
          name: "toast-show",
          values: {
            message: "Resource reward added successfully",
            variant: "success",
            title: "Success",
          },
        },
      ]),
    );

    return <ModifyResourceOfActionForm hx-swap-oob="true" />;
  } catch (error) {
    if (catchConstraintByName(error, "unique_action_resource_reward")) {
      context.header(
        "HX-Trigger",
        createEvents([{
          name: "form-error",
          values: { resourceId: "Resource already exist on action" },
        }]),
      );
      return <p>Failed to add resource reward</p>;
    }
    throw error;
  }
};

const inputSchema = v.object({
  resourceId: v.pipe(v.string(), v.uuid()),
});

export const addActionResourceRewardsRoute = createRoute({
  path: "/api/games/:gameId/admin/actions/:actionId/add-resource-rewards",
  component: AddActionResourceRewards,
  partial: true,
  permission: {
    check: isAdminOfGame,
    redirectPath: "/games",
  },
  formValidationSchema: inputSchema,
  hmr: Deno.env.get("ENV") === "local",
});
