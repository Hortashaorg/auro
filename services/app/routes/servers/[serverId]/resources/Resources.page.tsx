import { Layout } from "@layout/Layout.tsx";
import { createRoute, getGlobalContext } from "@kalena/framework";
import { hasAccessToServer } from "@permissions/index.ts";
import { Title } from "@comp/atoms/typography/index.ts";
import { ResourcesTable } from "./ResourcesTable.section.tsx";
import { throwError } from "@package/common";

const ResourcesPage = () => {
  const context = getGlobalContext();
  const serverId = context.req.param("serverId") ??
    throwError("Server ID not found in route params");

  return (
    <Layout title="Resources">
      <Title level="h1">Resources</Title>
      <ResourcesTable serverId={serverId} />
    </Layout>
  );
};

export const playerResourcesRoute = createRoute({
  path: "/servers/:serverId/resources",
  component: ResourcesPage,
  permission: {
    check: hasAccessToServer,
    redirectPath: "/servers",
  },
  partial: false,
  hmr: Deno.env.get("ENV") === "local",
});
