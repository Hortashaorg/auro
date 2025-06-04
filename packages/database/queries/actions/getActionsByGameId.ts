import { db, eq, schema } from "@db/mod.ts";

export const getActionsByGameId = async (gameId: string) => {
  const actions = await db
    .select()
    .from(schema.action)
    .innerJoin(schema.asset, eq(schema.action.assetId, schema.asset.id))
    .innerJoin(
      schema.location,
      eq(schema.action.locationId, schema.location.id),
    )
    .where(
      eq(schema.action.gameId, gameId),
    );

  return actions;
};
