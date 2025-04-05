import { Layout } from "@layout/Layout.tsx";
import { createRoute } from "@kalena/framework";
import { throwError } from "@package/common";
import { isPlayerOfServer } from "@permissions/index.ts";
import { Title } from "@comp/atoms/typography/index.ts";
import { ActionsSection } from "./ActionsSection.section.tsx";
import { getServer } from "@queries/server/servers.ts";

const Server = async () => {
  const serverId = serverRoute.context().req.param("serverId") ??
    throwError("Server ID not found in route params");
  const server = await getServer(serverId);

  return (
    <Layout title={`Server - ${server.name}`}>
      <Title level="h1">
        Welcome to {server.name}
      </Title>
      <ActionsSection />
    </Layout>
  );
};

export const serverRoute = createRoute({
  path: "/servers/:serverId",
  component: Server,
  permission: {
    check: isPlayerOfServer,
    redirectPath: "/servers",
  },
  partial: false,
  hmr: Deno.env.get("ENV") === "local",
});
