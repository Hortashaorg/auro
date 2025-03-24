import { createRoute, v } from "@kalena/framework";
import { isPlayerOfServer } from "@permissions/index.ts";
import { db, eq, schema } from "@package/database";
import { throwError } from "@package/common";
import { getUserByEmail } from "@queries/getUserByEmail.ts";
import { ResourcesTable } from "@sections/views/ResourcesTable.tsx";

const ExecuteAction = async () => {
  const context = executeActionRoute.context();
  const params = context.req.valid("param");
  const { actionId, serverId } = params.success
    ? params.output
    : throwError("Invalid params");

  const userEmail = context.var.email ?? throwError("Missing user email");

  const user = await getUserByEmail(userEmail, serverId);

  if (user.availableActions <= 0) {
    // TODO: Event to notify user that they have no actions left
    return <ResourcesTable serverId={serverId} hx-swap-oob="true" />;
  }

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

  const rewardUpdates = earnedRewards.map(
    (reward) => {
      if (
        reward.action_resource_reward.quantityMin >
          reward.action_resource_reward.quantityMax
      ) throwError("Invalid quantity range");

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
  return <ResourcesTable serverId={serverId} hx-swap-oob="true" />;
};

export const executeActionRoute = createRoute({
  path: "/api/servers/:serverId/actions/:actionId/execute",
  component: ExecuteAction,
  permission: {
    check: isPlayerOfServer,
    redirectPath: "/servers",
  },
  paramValidationSchema: v.object({
    serverId: v.pipe(v.string(), v.uuid()),
    actionId: v.pipe(v.string(), v.uuid()),
  }),
  partial: false,
  hmr: Deno.env.get("ENV") === "local",
});
