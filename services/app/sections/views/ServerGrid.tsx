import { Grid } from "@comp/layout/Grid.tsx";
import { Card } from "@comp/layout/Card.tsx";
import { Text } from "@comp/content/Text.tsx";
import { Badge } from "@comp/content/Badge.tsx";
import { ButtonLink } from "@comp/navigation/ButtonLink.tsx";
import { getGlobalContext, type JSX } from "@kalena/framework";
import { Flex } from "@comp/layout/Flex.tsx";
import { visableServersForUser } from "@queries/servers.ts";
import { throwError } from "@package/common";

type Props = JSX.IntrinsicElements["div"];

export const ServerGrid = async ({ ...props }: Props) => {
  const globalContext = getGlobalContext();

  // Fetch servers that are either online or where user is admin
  const email = globalContext.var.email ?? throwError("No email");
  const servers = await visableServersForUser(email);
  return (
    <Grid
      gap="md"
      content="medium"
      id="section-server-grid"
      {...props}
    >
      {servers.map((server) => (
        <Card key={server.id} className="p-4 space-y-4">
          <Flex justify="between" items="start">
            <Text variant="header" className="text-xl truncate mr-2">
              {server.name}
            </Text>
            <Badge
              variant={server.online ? "success" : "danger"}
              size="sm"
              className="shrink-0"
            >
              {server.online ? "Online" : "Offline"}
            </Badge>
          </Flex>
          <ButtonLink
            href={`/server/${server.id}/join`}
            variant="primary"
            width="full"
            disabled={!server.online}
          >
            Join Server
          </ButtonLink>
        </Card>
      ))}
    </Grid>
  );
};
