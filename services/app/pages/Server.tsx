import { Layout } from "@comp/layout/Layout.tsx";
import { createRoute } from "@kalena/framework";
import { Text } from "@comp/content/Text.tsx";
import { throwError } from "@package/common";
import { hasAccessToServer } from "@permissions/index.ts";
import { serverAndUser } from "@queries/serverAndUser.ts";

const Server = async () => {
  const context = await serverRoute.customContext();
  const server = context.server;
  const user = context.user;

  return (
    <Layout title={server.name}>
      <Text variant="header">{server.name}</Text>
      {user.type === "admin"
        ? <Text variant="paragraph">Admin Dashboard</Text>
        : <Text variant="paragraph">Player Dashboard</Text>}
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
