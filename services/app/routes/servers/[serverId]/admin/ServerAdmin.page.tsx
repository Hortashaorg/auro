import { Layout } from "@layout/Layout.tsx";
import { createRoute } from "@kalena/framework";
import { throwError } from "@package/common";
import { hasAccessToServer } from "@permissions/index.ts";
import { serverAndUser } from "@queries/user/serverAndUser.ts";
import { ServerStatusCard } from "./ServerStatusCard.section.tsx";

const ServerAdmin = async () => {
  const context = await serverAdminRoute.customContext();
  const server = context.server;

  return (
    <Layout title={`Server Admin - ${server.name}`}>
      <ServerStatusCard server={server} />
    </Layout>
  );
};

export const serverAdminRoute = createRoute({
  path: "/servers/:serverId/admin",
  component: ServerAdmin,
  permission: {
    check: hasAccessToServer,
    redirectPath: "/servers",
  },
  partial: false,
  hmr: Deno.env.get("ENV") === "local",
  customContext: (c) => {
    const serverId = c.req.param("serverId");
    const email = c.var.email ?? throwError("Email not found");

    return serverAndUser(serverId, email);
  },
});
