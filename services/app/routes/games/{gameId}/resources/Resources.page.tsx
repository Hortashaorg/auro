import { Layout } from "@layout/Layout.tsx";
import { createRoute } from "@kalena/framework";
import { isPlayerOfGame } from "@permissions/index.ts";
import { Title } from "@comp/atoms/typography/index.ts";
import { ResourcesTable } from "./ResourcesTable.section.tsx";
import { userContext } from "@contexts/userContext.ts";

const ResourcesPage = async () => {
  const userContext = await playerResourcesRoute.customContext();

  return (
    <Layout title="Resources">
      <Title level="h1">Resources</Title>
      <ResourcesTable userId={userContext.user.id} />
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
  customContext: userContext,
  partial: false,
  hmr: Deno.env.get("ENV") === "local",
});
