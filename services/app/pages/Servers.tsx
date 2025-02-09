import { Layout } from "@layouts/Layout.tsx";
import { Text } from "@comp/Text.tsx";
import { Card } from "@comp/Card.tsx";
import { Grid } from "@comp/layout/Grid.tsx";
import { Flex } from "@comp/layout/Flex.tsx";
import { Badge } from "@comp/Badge.tsx";
import { Modal } from "@comp/modal/Modal.tsx";
import { ButtonLink } from "@comp/ButtonLink.tsx";
import { db } from "@package/database";
import { ModalButton } from "@comp/modal/ModalButton.tsx";

export const Servers = async () => {
  // Fetch all servers
  const servers = await db.query.server.findMany({
    orderBy: (server, { desc }) => [desc(server.updatedAt)],
  });

  return (
    <Layout title="Select Server">
      <ModalButton modalRef="serverModal">
        Open Modal
      </ModalButton>

      <Modal title="Hello world" modalRef="serverModal">
        yo
      </Modal>

      <Grid cols={2} gap={4}>
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
