import { db, eq, type InferInsertModel, schema } from "@package/database";

export type ActionResourceRewardUpdate = Partial<
  Omit<
    InferInsertModel<typeof schema.actionResourceReward>,
    "id" | "createdAt" | "updatedAt"
  >
>;

export const updateActionResourceRewards = async (
  updates: { id: string; updates: ActionResourceRewardUpdate }[],
) => {
  console.log(updates)
  await db.transaction(async (tx) => {
    for (const { id, updates: updateFields } of updates) {
      await tx.update(schema.actionResourceReward)
        .set({
          ...updateFields,
          updatedAt: Temporal.Now.instant(),
        })
        .where(eq(schema.actionResourceReward.id, id));
    }
  });
};
