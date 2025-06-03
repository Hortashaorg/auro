import { type InferInsertModel, sql } from "drizzle-orm";
import { db, schema, type Transaction } from "@db/mod.ts";
import { throwError } from "@package/common";

type SetActionResourceCostData = Omit<
  InferInsertModel<typeof schema.actionResourceCost>,
  "updatedAt" | "createdAt"
>;
export const setActionResourceCosts = async (
  data: SetActionResourceCostData[],
  tx?: Transaction,
) => {
  const transaction = tx ?? db;
  return await transaction
    .insert(schema.actionResourceCost)
    .values(data)
    .onConflictDoUpdate({
      target: [
        schema.actionResourceCost.actionId,
        schema.actionResourceCost.resourceId,
      ],
      set: {
        quantity: sql`excluded.quantity`,
        updatedAt: Temporal.Now.instant(),
      },
    })
    .returning();
};

export const setActionResourceCost = async (
  data: SetActionResourceCostData,
  tx?: Transaction,
) => {
  const actionResourceCosts = await setActionResourceCosts([data], tx);
  return actionResourceCosts[0] ??
    throwError("Action Resource Cost should exist");
};
