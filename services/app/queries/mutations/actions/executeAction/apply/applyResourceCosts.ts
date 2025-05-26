import { eq, schema } from "@package/database";
import type { Action, Transaction, User } from "../types.ts";
import { throwError } from "@package/common";

export const applyResourceCosts = async (
  tx: Transaction,
  user: User,
  action: Action,
) => {
  // Subtract resource costs from user
  for (const cost of action.actionResourceCosts) {
    const userResource = user.userResources.find(
      (ur) => ur.resourceId === cost.resourceId,
    ) ?? throwError("We know this should exist from validation");

    await tx
      .update(schema.userResource)
      .set({
        quantity: userResource.quantity - cost.quantity,
        updatedAt: Temporal.Now.instant(),
      })
      .where(eq(schema.userResource.id, userResource.id));
  }
};
