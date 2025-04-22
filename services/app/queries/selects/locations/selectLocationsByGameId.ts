import { db, eq, schema } from "@package/database";

export const selectLocationsByGameId = (gameId: string) => {
  return db.select()
    .from(schema.location)
    .where(eq(schema.location.gameId, gameId));
};
