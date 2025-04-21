import { Layout } from "@layout/Layout.tsx";
import { createRoute, getGlobalContext } from "@kalena/framework";
import { isPlayerOfGame } from "@permissions/index.ts";
import { Title } from "@comp/atoms/typography/index.ts";
import { ResourcesTable } from "./ResourcesTable.section.tsx";
import { throwError } from "@package/common";

const ResourcesPage = () => {
  const context = getGlobalContext();
  const gameId = context.req.param("gameId") ??
    throwError("Game ID not found in route params");

  return (
    <Layout title="Resources">
      <Title level="h1">Resources</Title>
      <ResourcesTable gameId={gameId} />
    </Layout>
  );
};

export const playerResourcesRoute = createRoute({
  path: "/games/:gameId/resources",
  component: ResourcesPage,
  permission: {
    check: isPlayerOfGame,
    redirectPath: "/games",
  },
  partial: false,
  hmr: Deno.env.get("ENV") === "local",
});
