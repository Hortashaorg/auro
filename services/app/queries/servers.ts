import { db } from "@package/database";
import { and, eq, or, schema } from "@package/database";

export const visableServersForUser = (email: string) => {
  return db.select({
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
      or(
        eq(schema.server.online, true),
        and(
          eq(schema.user.type, "admin"),
          eq(schema.account.email, email),
        ),
      ),
    );
};
