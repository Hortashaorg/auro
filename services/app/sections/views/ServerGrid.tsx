import { Grid } from "@comp/layout/Grid.tsx";
import { Card } from "@comp/layout/Card.tsx";
import { Flex } from "@comp/layout/Flex.tsx";
import { Text } from "@comp/content/Text.tsx";
import { Badge } from "@comp/content/Badge.tsx";
import { ButtonLink } from "@comp/navigation/ButtonLink.tsx";
import type { schema } from "@package/database";
import type { JSX } from "@kalena/framework";

type Props = JSX.IntrinsicElements["div"] & {
  servers: typeof schema.server.$inferSelect[];
};

export const ServerGrid = ({ servers, ...props }: Props) => {
  return (
    <Grid cols={2} gap={4} id="section-server-grid" {...props}>
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
