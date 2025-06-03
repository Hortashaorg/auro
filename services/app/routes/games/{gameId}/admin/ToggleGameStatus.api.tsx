import { createRoute } from "@kalena/framework";
import { queries } from "@package/database";
import { isAdminOfGame } from "@permissions/index.ts";
import { GameStatusCard } from "./GameStatusCard.section.tsx";

const ToggleGameStatus = async () => {
  const context = toggleGameStatusRoute.context();
  const gameId = context.req.param("gameId");

  const game = await queries.games.getGameById(gameId);

  const updatedGame = await queries.games.setGame({
    ...game,
    online: !game.online,
  });

  return <GameStatusCard game={updatedGame} />;
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
