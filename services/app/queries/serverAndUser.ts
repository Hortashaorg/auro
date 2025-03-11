import { and, db, eq, schema } from "@package/database";
import { throwError } from "@package/common";

export const serverAndUser = async (serverId: string, email: string) => {
  const [serverData] = await db.select().from(schema.server).where(
    eq(schema.server.id, serverId),
  );

  const [userData] = await db.select().from(schema.user)
    .innerJoin(schema.account, eq(schema.user.accountId, schema.account.id))
    .where(
      and(
        eq(schema.user.serverId, serverId),
        eq(schema.account.email, email),
      ),
    );

  if (!userData) {
    const [accountData] = await db.select().from(schema.account).where(
      eq(schema.account.email, email),
    );

    const account = accountData ?? throwError("Account not found");

    await db.insert(schema.user).values({
      serverId,
      type: "player",
      accountId: account.id,
      name: account.nickname,
    });
  }
  const user = userData?.user ?? throwError("User not found");

  const server = serverData ?? throwError("Server not found");

  return { server, user };
};
