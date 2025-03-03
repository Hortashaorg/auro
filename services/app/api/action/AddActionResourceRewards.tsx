import { isAdminOfServer } from "@permissions/index.ts";
import { createRoute, v } from "@kalena/framework";
import { throwError } from "@package/common";
import { createEvents } from "@comp/utils/events.ts";
import { db, PostgresError, schema } from "@package/database";
import { ModifyResourceOfActionForm } from "@sections/forms/ModifyResourceOfActionForm.tsx";

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
    await db.insert(schema.actionResourceReward).values({
      actionId,
      resourceId: result.output.resourceId,
      chance: 100,
      quantityMax: 1,
      quantityMin: 1,
    });

    context.header(
      "HX-Trigger",
      createEvents([
        { name: "close-dialog", values: { value: true } },
        { name: "clear-form", values: { value: true } },
      ]),
    );

    return <ModifyResourceOfActionForm hx-swap-oob="true" />;
  } catch (error) {
    if (error instanceof PostgresError) {
      if (error.constraint_name === "unique_action_resource_reward") {
        context.header(
          "HX-Trigger",
          createEvents([{
            name: "form-error",
            values: { resourceId: "Resource already exist on action" },
          }]),
        );
        return <p>Failed to add resource reward</p>;
      }
    }
    throw error;
  }
};

const inputSchema = v.object({
  resourceId: v.pipe(v.string(), v.uuid()),
});

export const addActionResourceRewardsRoute = createRoute({
  path: "/api/servers/:serverId/actions/:actionId/resource-rewards/add",
  component: AddActionResourceRewards,
  partial: true,
  permission: {
    check: isAdminOfServer,
    redirectPath: "/servers",
  },
  formValidationSchema: inputSchema,
  hmr: Deno.env.get("ENV") === "local",
});
