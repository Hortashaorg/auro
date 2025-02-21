import type { Context } from "@kalena/framework";
import { db, eq, schema, sql } from "@package/database";

export const isPublic = (): boolean => {
  return true;
};

export const isDenied = (): boolean => {
  return false;
};

export const hasAccessToServer = async (
  c: Context,
): Promise<boolean> => {
  const serverId = c.req.param("id");

  // Check if server exists and is online
  const [server] = await db.select({
    id: schema.server.id,
    name: schema.server.name,
    online: schema.server.online,
    updatedAt: schema.server.updatedAt,
    createdAt: schema.server.createdAt,
    userIsAdmin: sql<boolean>`${eq(schema.user.type, "admin")}`,
  }).from(schema.server).leftJoin(
    schema.user,
    eq(schema.server.id, schema.user.serverId),
  ).where(eq(schema.server.id, serverId));

  const isLoggedInAndServerAccessable = !!server && server.online &&
    !!c.var.isLoggedIn;

  const isServerAdmin = !!server && server.userIsAdmin;

  return isLoggedInAndServerAccessable || isServerAdmin;
};
