import { Layout } from "@layout/Layout.tsx";
import { createRoute } from "@kalena/framework";
import { isAdminOfGame } from "@permissions/index.ts";
import { GameStatusCard } from "./GameStatusCard.section.tsx";
import { userContext } from "@contexts/userContext.ts";
import { selectGameById } from "@queries/selects/games/selectGameById.ts";

const GameAdmin = async () => {
  const { user } = await gameAdminRoute.customContext();
  const game = await selectGameById(user.gameId);

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
