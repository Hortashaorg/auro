import { db, eq, schema } from "@package/database";

export const selectGamesByEmail = async (email: string) => {
  return await db.select()
    .from(schema.user)
    .innerJoin(schema.account, eq(schema.user.accountId, schema.account.id))
    .innerJoin(schema.game, eq(schema.user.gameId, schema.game.id))
    .orderBy(schema.game.name)
    .where(eq(schema.account.email, email));
};
