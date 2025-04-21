import { db, type InferInsertModel, schema } from "@package/database";

type CreateActionData = InferInsertModel<typeof schema.action>;

export const createAction = async (data: CreateActionData) => {
  await db.insert(schema.action)
    .values({
      name: data.name,
      description: data.description,
      gameId: data.gameId,
      assetId: data.assetId,
      locationId: data.locationId,
      cooldownMinutes: data.cooldownMinutes,
      repeatable: data.repeatable,
    });
};
