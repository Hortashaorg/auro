import { Layout } from "@layout/Layout.tsx";
import { createRoute } from "@kalena/framework";
import { throwError } from "@package/common";
import { isPlayerOfGame } from "@permissions/index.ts";
import { Title } from "@comp/atoms/typography/index.ts";
import { ActionsSection } from "./ActionsSection.section.tsx";
import { getGame } from "@queries/game/games.ts";
import { userContext } from "@contexts/userContext.ts";

const Game = async () => {
  const gameId = gameRoute.context().req.param("gameId") ??
    throwError("Game ID not found in route params");
  const game = await getGame(gameId);

  return (
    <Layout title={`Game - ${game.name}`}>
      <Title level="h1">
        Welcome to {game.name}
      </Title>
      <ActionsSection />
    </Layout>
  );
};

export const gameRoute = createRoute({
  path: "/games/:gameId",
  component: Game,
  permission: {
    check: isPlayerOfGame,
    redirectPath: "/games",
  },
  partial: false,
  hmr: Deno.env.get("ENV") === "local",
  customContext: userContext,
});
