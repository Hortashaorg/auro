import { db, eq, type InferInsertModel, schema } from "@package/database";

export type ActionResourceCostUpdate = Partial<
  Omit<
    InferInsertModel<typeof schema.actionResourceCost>,
    "id" | "createdAt" | "updatedAt"
  >
>;

/**
 * Batch update for actionResourceCost rows.
 * @param updates - Array of { id, updates } objects
 */
export const updateActionResourceCosts = async (
  updates: { id: string; updates: ActionResourceCostUpdate }[],
) => {
  await db.transaction(async (tx) => {
    for (const { id, updates: updateFields } of updates) {
      await tx.update(schema.actionResourceCost)
        .set({
          ...updateFields,
          updatedAt: Temporal.Now.instant(),
        })
        .where(eq(schema.actionResourceCost.id, id));
    }
  });
};
