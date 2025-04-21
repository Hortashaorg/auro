import { db } from "@package/database";
import { and, eq, schema } from "@package/database";
import { throwError } from "@package/common";

export const gamesWhereUserIsAdmin = async (email: string) => {
  const res = await db.select({
    id: schema.game.id,
    name: schema.game.name,
    online: schema.game.online,
    updatedAt: schema.game.updatedAt,
    createdAt: schema.game.createdAt,
  })
    .from(schema.game)
    .leftJoin(schema.user, eq(schema.game.id, schema.user.gameId))
    .innerJoin(schema.account, eq(schema.user.accountId, schema.account.id))
    .where(
      and(
        eq(schema.user.type, "admin"),
        eq(schema.account.email, email),
      ),
    );

  return res;
};

export const onlineGames = async () => {
  const res = await db.select().from(schema.game).where(
    eq(schema.game.online, true),
  );

  return res;
};

export const getGame = async (gameId: string) => {
  const res = await db.select().from(schema.game).where(
    eq(schema.game.id, gameId),
  );

  return res[0] ?? throwError("Game not found");
};
