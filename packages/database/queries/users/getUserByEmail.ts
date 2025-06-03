import { and, db, eq, schema } from "@db/mod.ts";

export const getUserByEmail = async (email: string, gameId: string) => {
  const [user] = await db
    .select()
    .from(schema.user)
    .innerJoin(
      schema.game,
      eq(schema.user.gameId, schema.game.id),
    )
    .innerJoin(
      schema.account,
      eq(schema.user.accountId, schema.account.id),
    )
    .innerJoin(schema.location, eq(schema.location.id, schema.user.locationId))
    .where(
      and(
        eq(schema.game.id, gameId),
        eq(schema.account.email, email),
      ),
    );
  return user;
};
