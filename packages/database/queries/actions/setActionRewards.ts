import { type InferInsertModel, sql } from "drizzle-orm";
import { db, schema, type Transaction } from "@db/mod.ts";
import { throwError } from "@package/common";

type SetActionResourceRewardData = Omit<
  InferInsertModel<typeof schema.actionResourceReward>,
  "updatedAt" | "createdAt"
>;
export const setActionResourceRewards = async (
  data: SetActionResourceRewardData[],
  tx?: Transaction,
) => {
  const transaction = tx ?? db;
  return await transaction
    .insert(schema.actionResourceReward)
    .values(data)
    .onConflictDoUpdate({
      target: [
        schema.actionResourceReward.actionId,
        schema.actionResourceReward.resourceId,
      ],
      set: {
        chance: sql`excluded.chance`,
        quantityMax: sql`excluded.quantity_max`,
        quantityMin: sql`excluded.quantity_min`,
        updatedAt: Temporal.Now.instant(),
      },
    })
    .returning();
};

export const setActionResourceReward = async (
  data: SetActionResourceRewardData,
  tx?: Transaction,
) => {
  const actionResourceRewards = await setActionResourceRewards([data], tx);
  return actionResourceRewards[0] ??
    throwError("Action Resource Reward should exist");
};
