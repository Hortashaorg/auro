import { schema } from "@package/database";
import type { Action, Transaction, User } from "../types.ts";

export const applyItemRewards = async (
  tx: Transaction,
  user: User,
  action: Action,
) => {
  const itemsGained = [];

  for (const itemReward of action.actionItemRewards) {
    // Check if item should be given based on chance (0-100)
    const shouldGiveItem = Math.random() * 100 < itemReward.chance;

    if (shouldGiveItem) {
      await tx
        .insert(schema.userItem)
        .values({
          userId: user.user.id,
          itemId: itemReward.itemId,
        });

      itemsGained.push({
        itemId: itemReward.itemId,
      });
    }
  }

  return { itemsGained };
};
