import { Layout } from "@layout/Layout.tsx";
import { createRoute } from "@kalena/framework";
import { isAdminOfGame } from "@permissions/index.ts";
import { GameStatusCard } from "./GameStatusCard.section.tsx";
import { userContext } from "@contexts/userContext.ts";
import { getGame } from "@queries/game/games.ts";

const GameAdmin = async () => {
  const { user } = await gameAdminRoute.customContext();
  const game = await getGame(user.gameId);

  return (
    <Layout title={`Game Admin - ${game.name}`}>
      <GameStatusCard game={game} />
    </Layout>
  );
};

export const gameAdminRoute = createRoute({
  path: "/games/:gameId/admin",
  component: GameAdmin,
  permission: {
    check: isAdminOfGame,
    redirectPath: "/games",
  },
  partial: false,
  hmr: Deno.env.get("ENV") === "local",
  customContext: userContext,
});
