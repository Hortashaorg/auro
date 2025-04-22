import { db, eq, schema } from "@package/database";

export const selectResourceCostsByActionId = (actionId: string) => {
  return db.select()
    .from(schema.actionResourceCost)
    .where(eq(schema.actionResourceCost.actionId, actionId));
};
