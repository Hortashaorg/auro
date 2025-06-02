import type { GlobalContext } from "@kalena/framework";
import { queries } from "@package/database";
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

  const data = await queries.users.getUserByEmail(email, gameId);

  if (!data) {
    const game = await queries.games.getGameById(gameId);
    if (!game.online) return false;

    const account = await queries.accounts.getAccountByEmail(email);

    const starterLocation = await queries.locations.getStarterLocationByGameId(
      game.id,
    );

    const user = await queries.users.setUser({
      gameId,
      type: "player",
      accountId: account.id,
      locationId: starterLocation.id,
      name: account.nickname,
      availableActions: game.startingAvailableActions,
    });

    return !!user && game.id === gameId && game.online;
  }

  return !!data && data.game.id === gameId && data.game.online;
};

export const isAdminOfGame = async (c: GlobalContext): Promise<boolean> => {
  const gameId = c.req.param("gameId");
  const email = c.var.email;

  if (!gameId || !email) {
    return false;
  }
  const data = await queries.users.getUserByEmail(email, gameId);

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
