import { db, eq, schema } from "@package/database";

export const selectResourceRewardsByActionId = (actionId: string) => {
  return db.select()
    .from(schema.actionResourceReward)
    .innerJoin(
      schema.resource,
      eq(schema.actionResourceReward.resourceId, schema.resource.id),
    )
    .where(eq(schema.actionResourceReward.actionId, actionId));
};
