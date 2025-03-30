import { db, eq, schema } from "@package/database";
import { throwError } from "@package/common";

/**
 * Get account data and all associated users across servers by email
 *
 * @param email The email address of the account to fetch
 * @returns The account and all associated users across servers
 * @throws Error if account not found
 */
export const getAccountWithUsers = async (email: string) => {
  // Get the account
  const account = await db.query.account.findFirst({
    where: (account, { eq }) => eq(account.email, email),
  }) ?? throwError("Account not found for email");

  // Get all users for this account across servers
  const userServers = await db.select({
    user: schema.user,
    server: schema.server,
  })
    .from(schema.user)
    .innerJoin(schema.server, eq(schema.user.serverId, schema.server.id))
    .where(eq(schema.user.accountId, account.id));

  return {
    account,
    userServers,
  };
};
