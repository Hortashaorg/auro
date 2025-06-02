import { db, eq, schema } from "@db/mod.ts";
import { throwError } from "@package/common";

export const getGameById = async (id: string) => {
  const [game] = await db.select().from(schema.game).where(
    eq(schema.game.id, id),
  );
  return game ?? throwError("Game not found");
};
