import { db, eq, schema } from "@package/database";
import { throwError } from "@package/common";

/**
 * Selects a user by email.
 * @param email - The email address of the user to find.
 * @returns The user object if found, otherwise null.
 */
export async function selectUserByEmail(email: string) {
  const users = await db
    .select({
      user: schema.user,
    })
    .from(schema.user)
    .innerJoin(schema.account, eq(schema.user.accountId, schema.account.id))
    .where(eq(schema.account.email, email))
    .limit(1);

  const data = users[0] ?? throwError("User not found");

  return data.user;
}
