import { Layout } from "@layout/Layout.tsx";
import { createRoute } from "@kalena/framework";
import { isPlayerOfGame } from "@permissions/index.ts";
import { Title } from "@comp/atoms/typography/index.ts";
import { ActionsSection } from "./ActionsSection.section.tsx";
import { userContext } from "@contexts/userContext.ts";

const Game = async () => {
  const { user } = await gameRoute.customContext();
  // Fetch game details separately if needed for the title, or adjust context/query
  // For now, assume game name might come from context or be less critical here
  const gameName = "Game"; // Placeholder - Adapt as needed

  return (
    <Layout title={`Game - ${gameName}`}>
      <Title level="h1">
        Welcome to {gameName}
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
