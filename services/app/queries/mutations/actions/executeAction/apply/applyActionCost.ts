import { eq, schema } from "@package/database";
import type { Action, Transaction, User } from "../types.ts";

export const applyActionCost = async (
  tx: Transaction,
  user: User,
  action: Action,
): Promise<void> => {
  // Decrease user's available actions
  await tx
    .update(schema.user)
    .set({
      availableActions: user.user.availableActions - 1,
      updatedAt: Temporal.Now.instant(),
    })
    .where(eq(schema.user.id, user.user.id));

  // Subtract resource costs from user
  for (const cost of action.actionResourceCosts) {
    const userResource = user.userResources.find(
      (ur) => ur.resourceId === cost.resourceId,
    );

    if (userResource) {
      await tx
        .update(schema.userResource)
        .set({
          quantity: userResource.quantity - cost.quantity,
          updatedAt: Temporal.Now.instant(),
        })
        .where(eq(schema.userResource.id, userResource.id));
    }
    // Note: We already validated user has sufficient resources,
    // so userResource should always exist here
  }
};
