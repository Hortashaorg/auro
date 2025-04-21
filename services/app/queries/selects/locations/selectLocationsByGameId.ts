import { db, eq, schema } from "@package/database";

export const selectLocationsByGameId = async (gameId: string) => {
  const locations = await db.select().from(schema.location)
    .innerJoin(schema.asset, eq(schema.location.assetId, schema.asset.id))
    .where(
      eq(schema.location.gameId, gameId),
    );

  return locations;
};
