import { db, eq, schema } from "@package/database";
import { throwError } from "@package/common";

/**
 * Get account data and all associated users across games by email
 *
 * @param email The email address of the account to fetch
 * @returns The account and all associated users across games
 * @throws Error if account not found
 */
export const getAccountWithUsers = async (email: string) => {
  // Get the account
  const account = await db.query.account.findFirst({
    where: (account, { eq }) => eq(account.email, email),
  }) ?? throwError("Account not found for email");

  // Get all users for this account across games
  const userGames = await db.select({
    user: schema.user,
    game: schema.game,
  })
    .from(schema.user)
    .innerJoin(schema.game, eq(schema.user.gameId, schema.game.id))
    .orderBy(schema.game.name)
    .where(eq(schema.user.accountId, account.id));

  return {
    account,
    userGames,
  };
};
