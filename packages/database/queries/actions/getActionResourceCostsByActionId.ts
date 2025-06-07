import { db, schema } from "@db/mod.ts";
import { eq, inArray } from "drizzle-orm";

export const getResourceCostsByActionIds = (
  actionIds: string[],
) => {
  return db
    .select()
    .from(schema.actionResourceCost)
    .innerJoin(
      schema.resource,
      eq(schema.actionResourceCost.resourceId, schema.resource.id),
    )
    .innerJoin(
      schema.asset,
      eq(schema.resource.assetId, schema.asset.id),
    )
    .where(
      inArray(schema.actionResourceCost.actionId, actionIds),
    );
};

export const getResourceCostsByActionId = (
  actionId: string,
) => {
  return getResourceCostsByActionIds([actionId]);
};
