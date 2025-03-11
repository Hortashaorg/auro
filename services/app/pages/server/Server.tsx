import { Layout } from "@sections/layout/Layout.tsx";
import { createRoute } from "@kalena/framework";
import { Text } from "@comp/content/Text.tsx";
import { throwError } from "@package/common";
import { hasAccessToServer } from "@permissions/index.ts";
import { serverAndUser } from "@queries/serverAndUser.ts";
import { AdminDashboard } from "@sections/views/AdminDashboard.tsx";

const PlayerDashboard = () => {
  return (
    <>
      <Text>Welcome to the server</Text>
    </>
  );
};

const Server = async () => {
  const context = await serverRoute.customContext();
  const server = context.server;
  const user = context.user;

  return (
    <Layout title={`Server - ${server.name}`}>
      <Text variant="h1" className="mb-8">{server.name}</Text>
      {user.type === "admin"
        ? <AdminDashboard server={server} />
        : <PlayerDashboard />}
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
