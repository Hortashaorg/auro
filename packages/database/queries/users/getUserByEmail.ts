import { and, db, eq, schema } from "@db/mod.ts";

export const getUserByEmail = async (email: string, gameId: string) => {
  const [user] = await db.select().from(schema.user).innerJoin(
    schema.game,
    eq(schema.user.gameId, schema.game.id),
  ).innerJoin(
    schema.account,
    eq(schema.user.accountId, schema.account.id),
  ).where(
    and(
      eq(schema.game.id, gameId),
      eq(schema.account.email, email),
    ),
  );
  return user;
};
