import type { GlobalContext } from "@kalena/framework";
import { and, db, eq, schema, sql } from "@package/database";

export const isPublic = (): boolean => {
  return true;
};

export const isDenied = (): boolean => {
  return false;
};

export const hasAccessToServer = async (
  c: GlobalContext,
): Promise<boolean> => {
  const serverId = c.req.param("serverId");

  // Check if server exists and is online
  const [server] = await db.select({
    id: schema.server.id,
    name: schema.server.name,
    online: schema.server.online,
    updatedAt: schema.server.updatedAt,
    createdAt: schema.server.createdAt,
    userIsAdmin: sql<boolean>`${eq(schema.user.type, "admin")}`,
  })
    .from(schema.server)
    .leftJoin(
      schema.user,
      eq(schema.server.id, schema.user.serverId),
    )
    .where(eq(schema.server.id, serverId));

  const isLoggedInAndServerAccessable = !!server && server.online &&
    !!c.var.isLoggedIn;

  const isServerAdmin = !!server && server.userIsAdmin;

  return isLoggedInAndServerAccessable || isServerAdmin;
};

export const isPlayerOfServer = async (c: GlobalContext): Promise<boolean> => {
  const serverId = c.req.param("serverId");
  const email = c.var.email;

  if (!serverId || !email) {
    return false;
  }

  const [data] = await db.select().from(schema.user).innerJoin(
    schema.server,
    eq(schema.user.serverId, schema.server.id),
  ).innerJoin(
    schema.account,
    eq(schema.user.accountId, schema.account.id),
  ).where(
    and(
      eq(schema.server.id, serverId),
      eq(schema.account.email, email),
    ),
  );

  return !!data && data.server.id === serverId;
};

export const isAdminOfServer = async (c: GlobalContext): Promise<boolean> => {
  const serverId = c.req.param("serverId");
  const email = c.var.email;

  if (!serverId || !email) {
    return false;
  }

  const [data] = await db.select().from(schema.user).innerJoin(
    schema.server,
    eq(schema.user.serverId, schema.server.id),
  ).innerJoin(
    schema.account,
    eq(schema.user.accountId, schema.account.id),
  ).where(
    and(
      eq(schema.server.id, serverId),
      eq(schema.account.email, email),
    ),
  );

  return !!data && data.user.type === "admin" && data.server.id === serverId;
};

export const isLoggedIn = (c: GlobalContext): boolean => {
  return !!c.var.isLoggedIn;
};
