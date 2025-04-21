import { and, db, eq, schema } from "@package/database";
import { throwError } from "@package/common";

export const gameAndUser = async (gameId: string, email: string) => {
  const [gameData] = await db.select().from(schema.game).where(
    eq(schema.game.id, gameId),
  );

  const game = gameData ?? throwError("Game not found");

  const [userData] = await db.select().from(schema.user)
    .innerJoin(schema.account, eq(schema.user.accountId, schema.account.id))
    .where(
      and(
        eq(schema.user.gameId, gameId),
        eq(schema.account.email, email),
      ),
    );

  const user = userData?.user ?? throwError("User not found");

  return { game, user };
};
