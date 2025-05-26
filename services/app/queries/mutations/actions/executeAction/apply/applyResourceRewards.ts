import { eq, schema } from "@package/database";
import type { Action, Transaction, User } from "../types.ts";

export const applyResourceRewards = async (
  tx: Transaction,
  user: User,
  action: Action,
): Promise<void> => {
  for (const reward of action.actionResourceRewards) {
    // Calculate reward quantity (handle random range)
    const rewardQuantity = reward.quantityMin === reward.quantityMax
      ? reward.quantityMin
      : Math.floor(
        Math.random() * (reward.quantityMax - reward.quantityMin + 1),
      ) + reward.quantityMin;

    // Check if reward should be given based on chance (0-100)
    const shouldGiveReward = Math.random() * 100 < reward.chance;

    if (shouldGiveReward && rewardQuantity > 0) {
      const existingUserResource = user.userResources.find(
        (ur) => ur.resourceId === reward.resourceId,
      );

      if (existingUserResource) {
        // Update existing resource
        await tx
          .update(schema.userResource)
          .set({
            quantity: existingUserResource.quantity + rewardQuantity,
            updatedAt: Temporal.Now.instant(),
          })
          .where(eq(schema.userResource.id, existingUserResource.id));
      } else {
        // Create new user resource
        await tx
          .insert(schema.userResource)
          .values({
            userId: user.user.id,
            resourceId: reward.resourceId,
            quantity: rewardQuantity,
          });
      }
    }
  }
};
