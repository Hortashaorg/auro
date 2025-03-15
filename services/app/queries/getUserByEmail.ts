import { and, db, eq, schema } from "@package/database";
import { throwError } from "@package/common";

export const getUserByEmail = async (email: string, serverId: string) => {
  const [userData] = await db.select()
    .from(schema.account)
    .leftJoin(schema.user, eq(schema.account.id, schema.user.accountId))
    .where(
      and(
        eq(schema.account.email, email),
        eq(schema.user.serverId, serverId),
      ),
    );

  const user = userData && userData.user
    ? userData.user
    : throwError("User not found");

  return user;
};
