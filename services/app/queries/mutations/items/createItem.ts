import { db, type InferInsertModel, schema } from "@package/database";

type CreateItemData = InferInsertModel<typeof schema.item>;

export const createItem = async (data: CreateItemData) => {
  await db.insert(schema.item)
    .values({
      name: data.name,
      description: data.description,
      gameId: data.gameId,
      assetId: data.assetId,
      rarity: data.rarity,
      stackable: data.stackable ?? false,
    });
};
