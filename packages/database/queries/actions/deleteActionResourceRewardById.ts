import { db, eq, schema, type Transaction } from "@db/mod.ts";

export const deleteActionResourceRewardById = async (
  rewardId: string,
  tx?: Transaction,
) => {
  const transaction = tx ?? db;
  await transaction
    .delete(schema.actionResourceReward)
    .where(
      eq(schema.actionResourceReward.id, rewardId),
    );
};
