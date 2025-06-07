import { schema } from "@db/mod.ts";
import { eq } from "drizzle-orm";
import type { Transaction, User } from "../types.ts";

export const applyUserActionCost = async (
  tx: Transaction,
  user: User,
) => {
  // Decrease user's available actions
  await tx
    .update(schema.user)
    .set({
      availableActions: user.user.availableActions - 1,
      updatedAt: Temporal.Now.instant(),
    })
    .where(eq(schema.user.id, user.user.id));

  return {
    actionsRemaining: user.user.availableActions - 1,
  };
};
