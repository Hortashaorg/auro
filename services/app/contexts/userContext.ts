import type { GlobalContext } from "@kalena/framework";
import { and, db, eq, schema } from "@package/database";

export const userContext = async (ctx: GlobalContext) => {
  const email = ctx.var.email;
  const gameId = ctx.req.param("gameId");

  if (!email) {
    throw new Error("Missing email of user");
  }

  if (!gameId) {
    throw new Error("Context can only be used within a game");
  }

  const [user] = await db.select().from(schema.account)
    .innerJoin(schema.user, eq(schema.account.id, schema.user.accountId))
    .innerJoin(schema.game, eq(schema.user.gameId, schema.game.id))
    .where(
      and(
        eq(schema.account.email, email),
        eq(schema.user.gameId, gameId),
      ),
    );

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};
