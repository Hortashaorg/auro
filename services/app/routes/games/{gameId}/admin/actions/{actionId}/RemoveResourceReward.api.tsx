import { isAdminOfGame } from "@permissions/index.ts";
import { createRoute } from "@kalena/framework";
import { createEvents } from "@comp/utils/events.ts";
import { queries } from "@package/database";
import { ModifyResourceOfActionForm } from "./ModifyResourceOfActionForm.section.tsx";

const RemoveResourceReward = async () => {
  const context = removeResourceRewardRoute.context();
  const rewardId = context.req.param("rewardId");

  try {
    await queries.actions.deleteActionResourceRewardById(rewardId);

    context.header(
      "HX-Trigger",
      createEvents([
        {
          name: "toast-show",
          values: {
            message: "Resource reward removed successfully",
            variant: "success",
            title: "Success",
          },
        },
      ]),
    );

    return <ModifyResourceOfActionForm hx-swap-oob="true" />;
  } catch (error) {
    console.error("Error removing resource reward:", error);

    context.header(
      "HX-Trigger",
      createEvents([
        {
          name: "toast-show",
          values: {
            message: "Failed to remove resource reward",
            variant: "danger",
            title: "Error",
          },
        },
      ]),
    );
    context.status(500);
    return <p>Error removing resource reward</p>;
  }
};

export const removeResourceRewardRoute = createRoute({
  path: "/games/:gameId/admin/actions/:actionId/remove-reward/:rewardId",
  component: RemoveResourceReward,
  permission: {
    check: isAdminOfGame,
    redirectPath: "/games",
  },
  partial: true,
  hmr: Deno.env.get("ENV") === "local",
});
