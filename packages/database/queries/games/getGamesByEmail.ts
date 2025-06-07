import { db, schema } from "@db/mod.ts";
import { eq } from "drizzle-orm";

export const getGamesByEmail = async (email: string) => {
  return await db.select()
    .from(schema.user)
    .innerJoin(schema.account, eq(schema.user.accountId, schema.account.id))
    .innerJoin(schema.game, eq(schema.user.gameId, schema.game.id))
    .orderBy(schema.game.name)
    .where(eq(schema.account.email, email));
};
