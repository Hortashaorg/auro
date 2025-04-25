import { db, eq, schema } from "@package/database";

export const selectResourcesByGameId = async (gameId: string) => {
  const resources = await db.select().from(schema.resource)
    .innerJoin(schema.asset, eq(schema.resource.assetId, schema.asset.id))
    .orderBy(schema.resource.name)
    .where(
      eq(schema.resource.gameId, gameId),
    );

  return resources;
};
