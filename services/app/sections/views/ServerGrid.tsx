import { Grid, HtmxWrapper, Section } from "@comp/wrappers/index.ts";
import { Card } from "@comp/atoms/card/index.ts";
import { CardContent } from "@comp/molecules/card/index.ts";
import { Badge, Text } from "@comp/typography/index.ts";
import { ButtonLink } from "@comp/atoms/buttons/index.ts";
import { getGlobalContext, type JSX } from "@kalena/framework";
import { onlineServers, serversWhereUserIsAdmin } from "@queries/servers.ts";
import { throwError } from "@package/common";

type Props = JSX.IntrinsicElements["div"];

export const ServerGrid = async ({ ...props }: Props) => {
  const globalContext = getGlobalContext();

  const email = globalContext.var.email ?? throwError("No email");

  // Split servers into admin and public sections
  const adminServers = await serversWhereUserIsAdmin(email);
  const publicServers = await onlineServers();

  return (
    <HtmxWrapper {...props} id="server-section">
      {adminServers.length > 0 && (
        <Section>
          <Text variant="h2">My Servers</Text>
          <Grid gap="md" content="small">
            {adminServers.map((server) => (
              <ServerCard key={server.id} server={server} />
            ))}
          </Grid>
        </Section>
      )}

      <Section>
        <Text variant="h2">Available Servers</Text>
        <Grid gap="md" content="small">
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
    <Card>
      <CardContent title={server.name}>
        <Badge
          variant={server.online ? "success" : "danger"}
          size="sm"
          className="shrink-0"
        >
          {server.online ? "Online" : "Offline"}
        </Badge>
        <ButtonLink
          href={`/servers/${server.id}`}
        >
          Enter
        </ButtonLink>
      </CardContent>
    </Card>
  );
};
