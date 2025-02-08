import { Layout } from "@layouts/Layout.tsx";
import { Text } from "@comp/Text.tsx";
import { Card } from "@comp/Card.tsx";
import { Grid } from "@comp/layout/Grid.tsx";
import { Badge } from "@comp/Badge.tsx";
import { ButtonLink } from "@comp/ButtonLink.tsx";
import { db } from "@package/database";

export const Servers = async () => {
  // Fetch all servers
  const servers = await db.query.server.findMany({
    orderBy: (server, { desc }) => [desc(server.updatedAt)],
  });

  return (
    <Layout title="Select Server">
      <div className="max-w-4xl mx-auto">
        <Text variant="header" className="mb-6">Select Server</Text>

        <Grid cols={2} gap={4}>
          {servers.map((server) => (
            <Card key={server.id} className="relative">
              <div className="flex justify-between items-start mb-2">
                <Text variant="header" className="text-xl">{server.name}</Text>
                <Badge
                  variant={server.online ? "success" : "danger"}
                  size="sm"
                >
                  {server.online ? "Online" : "Offline"}
                </Badge>
              </div>

              <div className="mt-4">
                <ButtonLink
                  href={`/server/${server.id}/join`}
                  variant="primary"
                  className="w-full"
                  disabled={!server.online}
                >
                  Join Server
                </ButtonLink>
              </div>
            </Card>
          ))}
        </Grid>
      </div>
    </Layout>
  );
};
