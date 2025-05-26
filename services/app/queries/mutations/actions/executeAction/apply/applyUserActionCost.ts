import { eq, schema } from "@package/database";
import type { Transaction, User } from "../types.ts";

export const applyUserActionCost = async (
  tx: Transaction,
  user: User,
): Promise<void> => {
  // Decrease user's available actions
  await tx
    .update(schema.user)
    .set({
      availableActions: user.user.availableActions - 1,
      updatedAt: Temporal.Now.instant(),
    })
    .where(eq(schema.user.id, user.user.id));
};
