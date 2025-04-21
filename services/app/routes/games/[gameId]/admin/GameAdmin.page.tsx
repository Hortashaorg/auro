import { Layout } from "@layout/Layout.tsx";
import { createRoute } from "@kalena/framework";
import { throwError } from "@package/common";
import { isAdminOfGame } from "@permissions/index.ts";
import { gameAndUser } from "@queries/user/gameAndUser.ts";
import { GameStatusCard } from "./GameStatusCard.section.tsx";

const GameAdmin = async () => {
  const context = await gameAdminRoute.customContext();
  const game = context.game;

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
  customContext: (c) => {
    const gameId = c.req.param("gameId");
    const email = c.var.email ?? throwError("Email not found");

    return gameAndUser(gameId, email);
  },
});
