import { db, eq, inArray, schema } from "@package/database";

export const getResourceRewardsByActionIds = (
  actionIds: string[],
) => {
  return db
    .select()
    .from(schema.actionResourceReward)
    .innerJoin(
      schema.resource,
      eq(schema.actionResourceReward.resourceId, schema.resource.id),
    )
    .where(
      inArray(schema.actionResourceReward.actionId, actionIds),
    );
};

export const getResourceRewardsByActionId = (
  actionId: string,
) => {
  return getResourceRewardsByActionIds([actionId]);
};
