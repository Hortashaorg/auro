import { createRoute } from "@kalena/framework";
import { db, schema } from "@package/database";
import { eq } from "@package/database";
import { throwError } from "@package/common";
import { isAdminOfGame } from "@permissions/index.ts";
import { GameStatusCard } from "./GameStatusCard.section.tsx";

/**
 * API endpoint to toggle a game's online status
 * Only administrators can toggle game status
 */
const ToggleGameStatus = async () => {
  const context = toggleGameStatusRoute.context();
  const gameId = context.req.param("gameId");

  // Get current game status
  const game = await db.query.game.findFirst({
    where: eq(schema.game.id, gameId),
    columns: {
      id: true,
      online: true,
    },
  }) ?? throwError("Game not found");

  // Toggle the status
  const updatedGame = await db
    .update(schema.game)
    .set({ online: !game.online })
    .where(eq(schema.game.id, gameId))
    .returning();

  const gameData = updatedGame[0] ??
    throwError("Failed to update game status");

  return <GameStatusCard game={gameData} />;
};

export const toggleGameStatusRoute = createRoute({
  path: "/api/games/:gameId/admin/toggle-game-status",
  component: ToggleGameStatus,
  permission: {
    check: isAdminOfGame,
    redirectPath: "/games",
  },
  partial: true,
  hmr: Deno.env.get("ENV") === "local",
});
