import { db, eq, schema } from "@package/database";

/**
 * Get all users and associated games for a specific account.
 *
 * @param accountId The ID of the account to fetch users for.
 * @returns A list of user and game objects for the account.
 */
export const selectGamesByAccountId = async (accountId: string) => {
  return await db.select({
    user: schema.user,
    game: schema.game,
  })
    .from(schema.user)
    .innerJoin(schema.game, eq(schema.user.gameId, schema.game.id))
    .orderBy(schema.game.name)
    .where(eq(schema.user.accountId, accountId));
};
