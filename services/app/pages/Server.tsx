import { Layout } from "@comp/layout/Layout.tsx";
import { createRoute } from "@kalena/framework";
import { Text } from "@comp/content/Text.tsx";
import { throwError } from "@package/common";
import { hasAccessToServer } from "@permissions/index.ts";
import { serverAndUser } from "@queries/serverAndUser.ts";
import type { InferSelectModel, schema } from "@package/database";

const AdminDashboard = (
  { server }: { server: InferSelectModel<typeof schema.server> },
) => {
  return (
    <>
      <Text variant="header">Server Status</Text>
      <Text>Status: {server.online ? "Online" : "Offline"}</Text>
    </>
  );
};

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
    <Layout title={server.name}>
      <Text variant="header" className="mb-8">{server.name}</Text>
      {user.type === "admin"
        ? <AdminDashboard server={server} />
        : <PlayerDashboard />}
    </Layout>
  );
};

export const serverRoute = createRoute({
  path: "/server/:id",
  component: Server,
  permission: {
    check: hasAccessToServer,
    redirectPath: "/servers",
  },
  partial: false,
  hmr: Deno.env.get("ENV") === "local",
  customContext: (c) => {
    const serverId = c.req.param("id");
    const email = c.var.email ?? throwError("Email not found");

    return serverAndUser(serverId, email);
  },
});
