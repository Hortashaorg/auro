import type { GlobalContext } from "@kalena/framework";
import { queries } from "@package/database";

export const userContext = async (ctx: GlobalContext) => {
  const email = ctx.var.email;
  const gameId = ctx.req.param("gameId");

  if (!email) {
    throw new Error("Missing email of user");
  }

  if (!gameId) {
    throw new Error("Context can only be used within a game");
  }

  const user = await queries.users.getUserByEmail(email, gameId);

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};
