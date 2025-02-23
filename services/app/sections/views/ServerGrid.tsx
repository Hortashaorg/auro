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
import { HtmxWrapper } from "@comp/layout/HtmxWrapper.tsx";

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
    <HtmxWrapper {...props} id="server-section">
      {adminServers.length > 0 && (
        <Section>
          <Text variant="h2">My Servers</Text>
          <Grid gap="md" content="medium">
            {adminServers.map((server) => (
              <ServerCard key={server.id} server={server} />
            ))}
          </Grid>
        </Section>
      )}

      <Section>
        <Text variant="h2">Available Servers</Text>
        <Grid gap="md" content="medium">
          {publicServers.map((server) => (
            <ServerCard key={server.id} server={server} />
          ))}
        </Grid>
      </Section>
    </HtmxWrapper>
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
        <Text variant="h1" className="text-xl truncate mr-2">
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
        href={`/servers/${server.id}`}
        variant="primary"
        width="full"
        disabled={!server.online}
      >
        Enter
      </ButtonLink>
    </Card>
  );
};
