import { db } from "@package/database";
import { and, eq, schema } from "@package/database";

export const serversWhereUserIsAdmin = async (email: string) => {
  const res = await db.select({
    id: schema.server.id,
    name: schema.server.name,
    online: schema.server.online,
    updatedAt: schema.server.updatedAt,
    createdAt: schema.server.createdAt,
  })
    .from(schema.server)
    .leftJoin(schema.user, eq(schema.server.id, schema.user.serverId))
    .innerJoin(schema.account, eq(schema.user.accountId, schema.account.id))
    .where(
      and(
        eq(schema.user.type, "admin"),
        eq(schema.account.email, email),
      ),
    );

  return res;
};

export const onlineServers = async () => {
  const res = await db.select().from(schema.server).where(
    eq(schema.server.online, true),
  );

  return res;
};
