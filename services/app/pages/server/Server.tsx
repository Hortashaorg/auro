import { Layout } from "@sections/layout/Layout.tsx";
import { createRoute } from "@kalena/framework";
import { throwError } from "@package/common";
import { hasAccessToServer } from "@permissions/index.ts";
import { serverAndUser } from "@queries/serverAndUser.ts";
import { AdminDashboard } from "@sections/views/AdminDashboard.tsx";
import { PlayerDashboard } from "@sections/views/PlayerDashboard.tsx";

const Server = async () => {
  const context = await serverRoute.customContext();
  const server = context.server;
  const user = context.user;

  return (
    <Layout title={`Server - ${server.name}`}>
      {user.type === "admin"
        ? <AdminDashboard server={server} />
        : <PlayerDashboard server={server} />}
    </Layout>
  );
};

export const serverRoute = createRoute({
  path: "/servers/:serverId",
  component: Server,
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
