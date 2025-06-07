import { db, schema } from "@db/mod.ts";
import { eq } from "drizzle-orm";

export const getItemsByGameId = async (
  gameId: string,
) => {
  return await db
    .select()
    .from(schema.item)
    .innerJoin(schema.asset, eq(schema.item.assetId, schema.asset.id))
    .orderBy(schema.item.name)
    .where(
      eq(schema.item.gameId, gameId),
    );
};
