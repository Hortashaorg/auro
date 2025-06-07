import { db, schema } from "@db/mod.ts";
import { throwError } from "@package/common";
import { and, eq } from "drizzle-orm";

export const getStarterLocationByGameId = async (gameId: string) => {
  const [location] = await db.select().from(schema.location).where(and(
    eq(schema.location.gameId, gameId),
    eq(schema.location.isStarterLocation, true),
  ));

  return location ?? throwError("Starter Location not found");
};
