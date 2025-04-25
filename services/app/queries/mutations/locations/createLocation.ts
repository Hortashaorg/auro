import { db, type InferInsertModel, schema } from "@package/database";

type CreateLocationData = InferInsertModel<typeof schema.location>;

export const createLocation = async (data: CreateLocationData) => {
  await db.insert(schema.location)
    .values({
      name: data.name,
      description: data.description,
      gameId: data.gameId,
      assetId: data.assetId,
    });
};
