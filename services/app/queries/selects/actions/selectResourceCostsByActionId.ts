import { db, eq, schema } from "@package/database";

export const selectResourceCostsByActionId = (actionId: string) => {
  return db.select()
    .from(schema.actionResourceCost)
    .innerJoin(
      schema.resource,
      eq(schema.actionResourceCost.resourceId, schema.resource.id),
    )
    .where(eq(schema.actionResourceCost.actionId, actionId));
};
