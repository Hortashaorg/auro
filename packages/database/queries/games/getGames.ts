import { db, schema } from "@db/mod.ts";

export const getGames = async () => {
  return await db
    .select()
    .from(schema.game)
    .orderBy(schema.game.name);
};
