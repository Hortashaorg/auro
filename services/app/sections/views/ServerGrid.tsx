import { Grid } from "@comp/layout/Grid.tsx";
import { Card } from "@comp/layout/Card.tsx";
import { Text } from "@comp/content/Text.tsx";
import { Badge } from "@comp/content/Badge.tsx";
import { ButtonLink } from "@comp/navigation/ButtonLink.tsx";
import { getGlobalContext, type JSX } from "@kalena/framework";
import { Flex } from "@comp/layout/Flex.tsx";
import { visableServersForUser } from "@queries/servers.ts";
import { throwError } from "@package/common";
import { Section } from "@comp/layout/Section.tsx";

type Props = JSX.IntrinsicElements["div"];

export const ServerGrid = async ({ ...props }: Props) => {
  const globalContext = getGlobalContext();

  const email = globalContext.var.email ?? throwError("No email");
  const servers = await visableServersForUser(email);

  // Split servers into admin and public sections
  const adminServers = servers.filter((server) => server.userIsAdmin);
  const publicServers = servers.filter((server) =>
    server.online && !server.userIsAdmin
  );

  return (
    <Flex {...props} className="grow" direction="col" gap="md">
      {adminServers.length > 0 && (
        <Section>
          <Text variant="header" className="mb-4">My Servers</Text>
          <Grid gap="md" content="medium">
            {adminServers.map((server) => (
              <ServerCard key={server.id} server={server} />
            ))}
          </Grid>
        </Section>
      )}

      <Section>
        <Text variant="header" className="mb-4">Available Servers</Text>
        <Grid gap="md" content="medium">
          {publicServers.map((server) => (
            <ServerCard key={server.id} server={server} />
          ))}
        </Grid>
      </Section>
    </Flex>
  );
};

const ServerCard = ({ server }: {
  server: {
    id: string;
    name: string;
    online: boolean;
  };
}) => {
  return (
    <Card className="p-4 space-y-4">
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
  );
};
