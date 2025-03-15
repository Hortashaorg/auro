import { createRoute } from "@kalena/framework";
import { isPlayerOfServer } from "@permissions/index.ts";
import { db, eq, schema } from "@package/database";
import { getAction } from "@queries/action.ts";
import { throwError } from "@package/common";
import { getUserByEmail } from "@queries/getUserByEmail.ts";

const ExecuteAction = async () => {
  const context = executeActionRoute.context();
  const actionId = context.req.param("actionId");
  const serverId = context.req.param("serverId");
  const userEmail = context.var.email ?? throwError("Missing user email");

  const action = await getAction(actionId);
  console.log(action);
  // We probebly need to check if player can execute this action, but we implement that later.

  const possibleRewards = await db.select()
    .from(schema.actionResourceReward)
    .innerJoin(
      schema.resource,
      eq(schema.actionResourceReward.resourceId, schema.resource.id),
    )
    .where(eq(schema.actionResourceReward.actionId, actionId));

  const earnedRewards = possibleRewards.filter((reward) => {
    const roll = Math.floor(Math.random() * 100) + 1;
    return roll <= reward.action_resource_reward.chance;
  });

  // Calculate quantities and prepare updates
  const rewardUpdates = earnedRewards.map(
    (reward) => {
      // Calculate random quantity between min and max
      const quantity = Math.floor(
        Math.random() *
          (reward.action_resource_reward.quantityMax -
            reward.action_resource_reward.quantityMin + 1),
      ) + reward.action_resource_reward.quantityMin;

      return {
        resourceId: reward.resource.id,
        quantity,
      };
    },
  );

  const user = await getUserByEmail(userEmail, serverId);

  const currentResources = await db.select()
    .from(schema.userResource)
    .where(eq(schema.userResource.userId, user.id));

  await db.transaction(async (tx) => {
    for (const reward of rewardUpdates) {
      const currentResource = currentResources.find((resource) =>
        resource.resourceId === reward.resourceId
      );

      if (currentResource) {
        await tx.update(schema.userResource)
          .set({
            quantity: currentResource.quantity + reward.quantity,
          })
          .where(eq(schema.userResource.id, currentResource.id));
      } else {
        await tx.insert(schema.userResource).values({
          userId: user.id,
          resourceId: reward.resourceId,
          quantity: reward.quantity,
        });
      }
    }
  });

  // Return the rewards for UI updates
  return <div>did reward user</div>;
};

export const executeActionRoute = createRoute({
  path: "/api/servers/:serverId/actions/:actionId/execute",
  component: ExecuteAction,
  permission: {
    check: isPlayerOfServer,
    redirectPath: "/servers",
  },
  partial: false,
  hmr: Deno.env.get("ENV") === "local",
});
