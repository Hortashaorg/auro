import type { GlobalContext } from "@kalena/framework";
import { and, db, eq, schema } from "@package/database";
import { throwError } from "@package/common";
import { accountContext } from "@contexts/accountContext.ts";

export const isPublic = (): boolean => {
  return true;
};

export const isDenied = (): boolean => {
  return false;
};

export const isPlayerOfGame = async (c: GlobalContext): Promise<boolean> => {
  const gameId = c.req.param("gameId");
  const email = c.var.email;

  if (!gameId || !email) {
    return false;
  }

  const [data] = await db.select().from(schema.user).innerJoin(
    schema.game,
    eq(schema.user.gameId, schema.game.id),
  ).innerJoin(
    schema.account,
    eq(schema.user.accountId, schema.account.id),
  ).where(
    and(
      eq(schema.game.id, gameId),
      eq(schema.account.email, email),
    ),
  );

  if (!data) {
    const [gameData] = await db.select().from(schema.game).where(
      eq(schema.game.id, gameId),
    );

    const game = gameData ?? throwError("Game not found");
    if (!game.online) return false;

    const [accountData] = await db.select().from(schema.account).where(
      eq(schema.account.email, email),
    );

    const account = accountData ?? throwError("Account not found");

    const locations = await db.select().from(schema.location).where(and(
      eq(schema.location.gameId, game.id),
      eq(schema.location.isStarterLocation, true),
    ));

    const starterLocation = locations[0] ??
      throwError("There should be one starter location");

    const [userData] = await db.insert(schema.user).values({
      gameId,
      type: "player",
      accountId: account.id,
      locationId: starterLocation.id,
      name: account.nickname,
      availableActions: game.startingAvailableActions,
    }).returning();

    return !!userData && game.id === gameId && game.online;
  }

  return !!data && data.game.id === gameId && data.game.online;
};

export const isAdminOfGame = async (c: GlobalContext): Promise<boolean> => {
  const gameId = c.req.param("gameId");
  const email = c.var.email;

  if (!gameId || !email) {
    return false;
  }

  const [data] = await db.select().from(schema.user).innerJoin(
    schema.game,
    eq(schema.user.gameId, schema.game.id),
  ).innerJoin(
    schema.account,
    eq(schema.user.accountId, schema.account.id),
  ).where(
    and(
      eq(schema.game.id, gameId),
      eq(schema.account.email, email),
    ),
  );

  return !!data && data.user.type === "admin" && data.game.id === gameId;
};

export const isLoggedIn = (c: GlobalContext): boolean => {
  return !!c.var.isLoggedIn;
};

export const canCreateGame = async (c: GlobalContext): Promise<boolean> => {
  try {
    const account = await accountContext(c);
    return account?.canCreateGame ?? false;
  } catch (error) {
    console.error("Permission check failed:", error);
    return false;
  }
};
