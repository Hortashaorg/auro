import { db, schema } from "@package/database";

export const selectGames = async () => {
  return await db.select()
    .from(schema.game)
    .orderBy(schema.game.name);
};
