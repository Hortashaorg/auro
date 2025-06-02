import { eq, schema } from "@package/database";
import type { Action, Transaction, User } from "../types.ts";
import { throwError } from "@package/common";

export const applyResourceChanges = async (
  tx: Transaction,
  user: User,
  action: Action,
) => {
  const resourceChanges: {
    resourceId: string;
    change: number;
  }[] = [];

  for (const cost of action.actionResourceCosts) {
    resourceChanges.push({
      resourceId: cost.resourceId,
      change: -cost.quantity,
    });
  }

  // Then, add all rewards (with chance calculations)
  for (const reward of action.actionResourceRewards) {
    // Calculate reward quantity (handle random range)
    const rewardQuantity = Math.floor(
      Math.random() * (reward.quantityMax - reward.quantityMin + 1),
    ) + reward.quantityMin;

    // Check if reward should be given based on chance (0-100)
    const shouldGiveReward = Math.random() * 100 < reward.chance;

    if (shouldGiveReward && rewardQuantity > 0) {
      resourceChanges.push({
        resourceId: reward.resourceId,
        change: rewardQuantity,
      });
    }
  }

  const deltas = new Map<string, number>();

  for (const change of resourceChanges) {
    const currentDelta = deltas.get(change.resourceId) || 0;
    deltas.set(change.resourceId, currentDelta + change.change);
  }

  for (const [resourceId, netChange] of deltas) {
    if (netChange === 0) continue; // No change needed

    const existingUserResource = user.userResources.find(
      (ur) => ur.resourceId === resourceId,
    );

    if (existingUserResource) {
      // Update existing resource with net change
      const newBalance = existingUserResource.quantity + netChange;
      await tx
        .update(schema.userResource)
        .set({
          quantity: newBalance,
          updatedAt: Temporal.Now.instant(),
        })
        .where(eq(schema.userResource.id, existingUserResource.id));
    } else if (netChange > 0) {
      // Create new user resource (only if net positive)
      await tx
        .insert(schema.userResource)
        .values({
          userId: user.user.id,
          resourceId: resourceId,
          quantity: netChange,
        });
    } else {
      console.log(existingUserResource);
      console.log(netChange);
      // This should not happen due to validation of validation steps.
      throwError(`Impossible`);
    }
  }

  return { resourceChanges };
};
