import { db, eq, schema } from "@package/database";

export const selectItemsByGameId = async (gameId: string) => {
  const items = await db.select().from(schema.item)
    .innerJoin(schema.asset, eq(schema.item.assetId, schema.asset.id))
    .where(
      eq(schema.item.gameId, gameId),
    );
  return items;
};
