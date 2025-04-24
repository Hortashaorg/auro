import { db, eq, schema } from "@package/database";
import { throwError } from "@package/common";

/**
 * Get a game by its ID.
 *
 * @param gameId The ID of the game to fetch.
 * @returns The game object or undefined if not found.
 */
export const selectGameById = async (gameId: string) => {
  const result = await db.select()
    .from(schema.game)
    .where(eq(schema.game.id, gameId))
    .limit(1);

  return result[0] ?? throwError("Game not found");
};
