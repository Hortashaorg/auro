import { schema } from "@db/mod.ts";
import type { Action, Transaction, User } from "../types.ts";

export const applyActionLog = async (
  tx: Transaction,
  user: User,
  action: Action,
  resourceChanges: { resourceId: string; change: number }[],
) => {
  const resourceEntries = resourceChanges.map((change) => ({
    type: change.change < 0 ? "cost" as const : "reward" as const,
    resourceId: change.resourceId,
    amount: Math.abs(change.change),
  }));

  await tx.insert(schema.actionLog).values({
    gameId: user.user.gameId,
    actionId: action.action.id,
    userId: user.user.id,
    version: 1,
    data: { resource: resourceEntries },
  });
};
