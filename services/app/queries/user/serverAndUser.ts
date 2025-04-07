import { and, db, eq, schema } from "@package/database";
import { throwError } from "@package/common";

export const serverAndUser = async (serverId: string, email: string) => {
  const [serverData] = await db.select().from(schema.server).where(
    eq(schema.server.id, serverId),
  );

  const server = serverData ?? throwError("Server not found");

  const [userData] = await db.select().from(schema.user)
    .innerJoin(schema.account, eq(schema.user.accountId, schema.account.id))
    .where(
      and(
        eq(schema.user.serverId, serverId),
        eq(schema.account.email, email),
      ),
    );

  const user = userData?.user ?? throwError("User not found");

  return { server, user };
};
