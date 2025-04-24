import { createRoute, v } from "@kalena/framework";
import { isPlayerOfGame } from "@permissions/index.ts";
import { throwError } from "@package/common";
import { createEvents } from "@comp/utils/events.ts";
import { ActionsSection } from "./ActionsSection.section.tsx";
import { userContext } from "@contexts/userContext.ts";
import { executeAction } from "@queries/mutations/actions/executeAction.ts";

const ExecuteAction = async () => {
  const context = executeActionRoute.context();
  const params = context.req.valid("param");
  const { actionId, gameId } = params.success
    ? params.output
    : throwError("Invalid params");

  const { user } = await executeActionRoute.customContext();

  const result = await executeAction(actionId, user.id);

  if (!result.success) {
    context.header(
      "HX-Trigger",
      createEvents([
        {
          name: "toast-show",
          values: {
            message: result.error || "Failed to execute action",
            title: "Action Failed",
            variant: "danger",
          },
        },
      ]),
    );
    return (
      <ActionsSection hx-swap-oob="true" gameId={gameId} userId={user.id} />
    );
  }

  context.header(
    "HX-Trigger",
    createEvents([
      {
        name: "toast-show",
        values: {
          message: "You have successfully executed the action",
          title: "Success",
          variant: "success",
        },
      },
    ]),
  );
  return <ActionsSection hx-swap-oob="true" gameId={gameId} userId={user.id} />;
};

export const executeActionRoute = createRoute({
  path: "/api/games/:gameId/actions/:actionId/execute",
  component: ExecuteAction,
  permission: {
    check: isPlayerOfGame,
    redirectPath: "/games",
  },
  paramValidationSchema: v.object({
    gameId: v.pipe(v.string(), v.uuid()),
    actionId: v.pipe(v.string(), v.uuid()),
  }),
  partial: false,
  hmr: Deno.env.get("ENV") === "local",
  customContext: userContext,
});
