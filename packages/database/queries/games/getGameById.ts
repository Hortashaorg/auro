import { db, schema } from "@db/mod.ts";
import { eq } from "drizzle-orm";
import { throwError } from "@package/common";

export const getGameById = async (id: string) => {
  const [game] = await db.select().from(schema.game).where(
    eq(schema.game.id, id),
  );
  return game ?? throwError("Game not found");
};
