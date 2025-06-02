import { and, db, eq, type InferInsertModel, schema } from "@package/database";

export type ActionResourceRewardUpdate = Partial<
  Omit<
    InferInsertModel<typeof schema.actionResourceReward>,
    "id" | "createdAt" | "updatedAt"
  >
>;

export const updateActionResourceRewards = async (
  updates: { id: string; updates: ActionResourceRewardUpdate }[],
  actionId: string,
) => {
  await db.transaction(async (tx) => {
    for (const { id, updates: updateFields } of updates) {
      await tx.update(schema.actionResourceReward)
        .set({
          ...updateFields,
          updatedAt: Temporal.Now.instant(),
        })
        .where(
          and(
            eq(schema.actionResourceReward.resourceId, id),
            eq(schema.actionResourceReward.actionId, actionId),
          ),
        );
    }
  });
};
