import { Layout } from "@layout/Layout.tsx";
import { createRoute } from "@kalena/framework";
import { isPlayerOfGame } from "@permissions/index.ts";
import { Title } from "@comp/atoms/typography/index.ts";
import { ActionsSection } from "./ActionsSection.section.tsx";
import { userContext } from "@contexts/userContext.ts";

const Game = async () => {
  const { user, game } = await gameRoute.customContext();

  return (
    <Layout title={`Game - ${game.name}`}>
      <Title level="h1">
        Welcome to {game.name}
      </Title>
      <ActionsSection gameId={user.gameId} userId={user.id} />
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
