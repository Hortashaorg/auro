import { db, eq, schema, sql } from "@package/database";
import { throwError } from "@package/common";

export interface ExecuteActionResult {
  success: boolean;
  error?: string;
  earnedRewards?: Array<{ resourceId: string; quantity: number }>;
  costs?: Array<{ resourceId: string; quantity: number }>;
  availableActions?: number;
}

export const executeAction = async (
  actionId: string,
  userId: string,
): Promise<ExecuteActionResult> => {
  // Fetch user
  const user =
    (await db.select().from(schema.user).where(eq(schema.user.id, userId)))[0];
  if (!user) return { success: false, error: "User not found" };
  if (user.availableActions <= 0) {
    return { success: false, error: "No actions left" };
  }

  // Fetch costs
  const costs = await db.select()
    .from(schema.actionResourceCost)
    .innerJoin(
      schema.resource,
      eq(schema.actionResourceCost.resourceId, schema.resource.id),
    )
    .where(eq(schema.actionResourceCost.actionId, actionId));

  // Fetch user resources
  const userResources = await db.select()
    .from(schema.userResource)
    .where(eq(schema.userResource.userId, userId));

  // Check if user has enough resources
  for (const cost of costs) {
    const userResource = userResources.find(
      (resource) =>
        resource.resourceId === cost.action_resource_cost.resourceId,
    );
    if (
      !userResource ||
      userResource.quantity < cost.action_resource_cost.quantity
    ) {
      return {
        success: false,
        error: `Not enough ${cost.resource.name}`,
      };
    }
  }

  // Fetch possible rewards
  const possibleRewards = await db.select()
    .from(schema.actionResourceReward)
    .innerJoin(
      schema.resource,
      eq(schema.actionResourceReward.resourceId, schema.resource.id),
    )
    .where(eq(schema.actionResourceReward.actionId, actionId));

  // Determine earned rewards
  const earnedRewards = possibleRewards.filter((reward) => {
    const roll = Math.floor(Math.random() * 100) + 1;
    return roll <= reward.action_resource_reward.chance;
  });

  const rewardUpdates = earnedRewards.map((reward) => {
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
  });

  // Fetch user resources with IDs for updating
  const userResourcesWithIds = await db.select()
    .from(schema.userResource)
    .where(eq(schema.userResource.userId, userId));

  // Transaction: deduct costs, add rewards, update user, log
  await db.transaction(async (tx) => {
    const updatedResources = [...userResourcesWithIds];
    for (const cost of costs) {
      const resourceIndex = updatedResources.findIndex(
        (resource) =>
          resource.resourceId === cost.action_resource_cost.resourceId,
      );
      const currentResource = updatedResources[resourceIndex];
      if (!currentResource) continue;
      await tx.update(schema.userResource)
        .set({
          quantity: currentResource.quantity -
            cost.action_resource_cost.quantity,
          updatedAt: Temporal.Now.instant(),
        })
        .where(eq(schema.userResource.id, currentResource.id));
      updatedResources[resourceIndex] = {
        ...currentResource,
        quantity: currentResource.quantity - cost.action_resource_cost.quantity,
      };
    }

    if (rewardUpdates.length > 0) {
      await tx
        .insert(schema.userResource)
        .values(
          rewardUpdates.map((reward) => ({
            userId,
            resourceId: reward.resourceId,
            quantity: reward.quantity,
          })),
        )
        .onConflictDoUpdate({
          target: [schema.userResource.userId, schema.userResource.resourceId],
          set: {
            quantity: sql`excluded.quantity + ${schema.userResource.quantity}`,
          },
        });
    }

    await tx.update(schema.user)
      .set({
        availableActions: user.availableActions - 1,
        updatedAt: Temporal.Now.instant(),
      })
      .where(eq(schema.user.id, userId));
    const resourceEntries = [
      ...costs.map((cost) => ({
        type: "cost" as const,
        resourceId: cost.action_resource_cost.resourceId,
        amount: cost.action_resource_cost.quantity,
      })),
      ...rewardUpdates.map((reward) => ({
        type: "reward" as const,
        resourceId: reward.resourceId,
        amount: reward.quantity,
      })),
    ];
    await tx.insert(schema.actionLog).values({
      gameId: user.gameId,
      actionId,
      userId,
      version: 1,
      data: { resource: resourceEntries },
    });
  });

  return {
    success: true,
    earnedRewards: rewardUpdates,
    costs: costs.map((cost) => ({
      resourceId: cost.action_resource_cost.resourceId,
      quantity: cost.action_resource_cost.quantity,
    })),
    availableActions: user.availableActions - 1,
  };
};
