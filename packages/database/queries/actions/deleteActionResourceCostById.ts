import { db, schema, type Transaction } from "@db/mod.ts";
import { eq } from "drizzle-orm";

export const deleteActionResourceCostById = async (
  costId: string,
  tx?: Transaction,
) => {
  const transaction = tx ?? db;
  await transaction
    .delete(schema.actionResourceCost)
    .where(
      eq(schema.actionResourceCost.id, costId),
    );
};
