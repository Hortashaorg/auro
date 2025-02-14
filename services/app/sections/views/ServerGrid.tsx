import { Grid } from "@kalena/components/layouts";
import { Card } from "@kalena/components/layouts";
import { Flex } from "@kalena/components/layouts";
import { Text } from "@kalena/components/content";
import { Badge } from "@kalena/components/content";
import { ButtonLink } from "@kalena/components/navigation";
import type { schema } from "@package/database";

type Props = {
  servers: typeof schema.server.$inferSelect[];
};

export const ServerGrid = ({ servers }: Props) => {
  return (
    <Grid cols={2} gap={4} id="section-server-grid">
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
  );
};
