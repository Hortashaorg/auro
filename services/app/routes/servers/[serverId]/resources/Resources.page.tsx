import { Layout } from "@layout/Layout.tsx";
import { createRoute } from "@kalena/framework";
import { hasAccessToServer } from "@permissions/index.ts";
import { Title } from "@comp/atoms/typography/index.ts";

const ResourcesPage = () => {
  return (
    <Layout title="Resources">
      <Title level="h1">Resources</Title>
      <p>Resource information will be displayed here.</p>
    </Layout>
  );
};

export const resourcesRoute = createRoute({
  path: "/servers/:serverId/resources",
  component: ResourcesPage,
  permission: {
    check: hasAccessToServer,
    redirectPath: "/servers",
  },
  partial: false,
  hmr: Deno.env.get("ENV") === "local",
});
