import { db, type InferInsertModel, schema } from "@package/database";

type CreateResourceData = InferInsertModel<typeof schema.resource>;
export const createResource = async (data: CreateResourceData) => {
  await db.insert(schema.resource)
    .values({
      name: data.name,
      description: data.description,
      gameId: data.gameId,
      assetId: data.assetId,
      leaderboard: data.leaderboard,
    });
};
