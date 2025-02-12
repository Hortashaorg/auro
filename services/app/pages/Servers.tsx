import { Layout } from "@layouts/Layout.tsx";
import { Text } from "@comp/content/Text.tsx";
import { Card } from "@comp/layout/Card.tsx";
import { Grid } from "@comp/layout/Grid.tsx";
import { Flex } from "@comp/layout/Flex.tsx";
import { Modal } from "@comp/overlay/modal/Modal.tsx";
import { ButtonLink } from "@comp/navigation/ButtonLink.tsx";
import { db, type schema } from "@package/database";
import { ModalButton } from "@comp/overlay/modal/ModalButton.tsx";
import { Badge } from "@comp/content/Badge.tsx";
import { CreateServerForm } from "@sections/forms/CreateServerForm.tsx";
import { createRoute } from "@package/framework";
import { isPublic } from "@permissions/index.ts";

const Servers = async () => {
  const context = await serversRoute.customContext();
  const canCreateServer = context.account?.canCreateServer ?? false;

  // Fetch all servers
  const servers = await db.query.server.findMany({
    orderBy: (server, { desc }) => [desc(server.updatedAt)],
  });

  return (
    <Layout title="Select Server">
      {canCreateServer && (
        <>
          <ModalButton modalRef="createServerModal" className="mb-4">
            Create Server
          </ModalButton>

          <Modal title="Create New Server" modalRef="createServerModal">
            <CreateServerForm />
          </Modal>
        </>
      )}

      <Grid cols={2} gap={4} id="serverList">
        {servers.map((server) => (
          <Card key={server.id} className="relative">
            <Flex direction="col" gap={4}>
              <Flex justify="between" align="start">
                <Text variant="header" className="text-xl">
                  {server.name}
                </Text>
                <Badge
                  variant={server.online ? "success" : "danger"}
                  size="sm"
                >
                  {server.online ? "Online" : "Offline"}
                </Badge>
              </Flex>

              <ButtonLink
                href={`/server/${server.id}/join`}
                variant="primary"
                className="w-full"
                disabled={!server.online}
              >
                Join Server
              </ButtonLink>
            </Flex>
          </Card>
        ))}
      </Grid>
    </Layout>
  );
};

export const serversRoute = createRoute({
  path: "/servers",
  component: Servers,
  permission: {
    check: isPublic,
    redirectPath: "/",
  },
  partial: false,
  hmr: Deno.env.get("ENV") === "local",
  customContext: async (c) => {
    let account: typeof schema.account.$inferSelect | undefined;

    const email = c.var.email;
    if (email) {
      account = await db.query.account.findFirst({
        where: (account, { eq }) => eq(account.email, email),
      });
    }
    return {
      account,
    };
  },
});
