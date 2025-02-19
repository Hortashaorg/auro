import { Grid } from "@comp/layout/Grid.tsx";
import { Card } from "@comp/layout/Card.tsx";
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
    <Grid
      gap="md"
      content="medium"
      id="section-server-grid"
      {...props}
    >
      {servers.map((server) => (
        <Card key={server.id} className="p-4 space-y-4">
          <div className="flex justify-between items-start">
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
          </div>
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
