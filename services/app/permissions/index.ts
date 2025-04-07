import type { GlobalContext } from "@kalena/framework";
import { and, db, eq, schema } from "@package/database";
import { throwError } from "@package/common";

export const isPublic = (): boolean => {
  return true;
};

export const isDenied = (): boolean => {
  return false;
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

  if (!data) {
    const [serverData] = await db.select().from(schema.server).where(
      eq(schema.server.id, serverId),
    );

    const server = serverData ?? throwError("Server not found");
    if (!server.online) return false;

    const [accountData] = await db.select().from(schema.account).where(
      eq(schema.account.email, email),
    );

    const account = accountData ?? throwError("Account not found");

    const [userData] = await db.insert(schema.user).values({
      serverId,
      type: "player",
      accountId: account.id,
      name: account.nickname,
      availableActions: server.startingAvailableActions,
    }).returning();

    return !!userData && server.id === serverId && server.online;
  }

  return !!data && data.server.id === serverId && data.server.online;
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
