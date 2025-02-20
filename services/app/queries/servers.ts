import { db } from "@package/database";
import { and, eq, or, schema, sql } from "@package/database";

export const visableServersForUser = async (email: string) => {
  const res = await db.select({
    id: schema.server.id,
    name: schema.server.name,
    online: schema.server.online,
    updatedAt: schema.server.updatedAt,
    createdAt: schema.server.createdAt,
    accountId: schema.account.id,
    userIsAdmin: sql<boolean>`${eq(schema.user.type, "admin")}`,
  })
    .from(schema.server)
    .leftJoin(schema.user, eq(schema.server.id, schema.user.serverId))
    .innerJoin(schema.account, eq(schema.user.accountId, schema.account.id))
    .where(
      or(
        eq(schema.server.online, true),
        and(
          eq(schema.user.type, "admin"),
          eq(schema.account.email, email),
        ),
      ),
    );

  return res;
};
