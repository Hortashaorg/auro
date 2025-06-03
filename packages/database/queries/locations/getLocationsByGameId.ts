import { db, eq, schema } from "@db/mod.ts";

export const getLocationsByGameId = async (gameId: string) => {
  return await db
    .select()
    .from(schema.location)
    .innerJoin(schema.asset, eq(schema.location.assetId, schema.asset.id))
    .where(
      eq(schema.location.gameId, gameId),
    );
};
