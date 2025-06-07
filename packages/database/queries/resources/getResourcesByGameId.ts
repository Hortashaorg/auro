import { db, schema } from "@db/mod.ts";
import { eq } from "drizzle-orm";

export const getResourcesByGameId = async (
  gameId: string,
) => {
  return await db
    .select()
    .from(schema.resource)
    .innerJoin(schema.asset, eq(schema.resource.assetId, schema.asset.id))
    .orderBy(schema.resource.name)
    .where(
      eq(schema.resource.gameId, gameId),
    );
};
