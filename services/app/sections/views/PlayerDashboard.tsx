import { InferSelectModel } from "@package/database";
import { schema } from "@package/database";
import { Text } from "@comp/content/Text.tsx";
import { Section } from "@comp/layout/Section.tsx";
import { Grid } from "@comp/layout/Grid.tsx";
import { Card } from "@comp/display/card/Card.tsx";
import { CardContent } from "@comp/display/card/CardContent.tsx";
import { CardImage } from "@comp/display/card/CardImage.tsx";
import { getServerActions } from "../../queries/serverActions.ts";
import { Button } from "@comp/inputs/Button.tsx";
import { ResourcesTable } from "./ResourcesTable.tsx";

export const PlayerDashboard = async (
  { server }: { server: InferSelectModel<typeof schema.server> },
) => {
  const actions = await getServerActions(server.id);

  return (
    <>
      <Text>
        Welcome to {server.name}
      </Text>

      <ResourcesTable serverId={server.id} />

      <Section>
        <Text variant="h2">Actions</Text>

        <Grid>
          {actions.map((action) => (
            <Card>
              <CardImage src={action.assetUrl} alt={action.name} />
              <CardContent>
                <Text>{action.name}</Text>
                <Button
                  hx-post={`/api/servers/${server.id}/actions/${action.id}/execute`}
                  hx-swap="none"
                >
                  Do it!
                </Button>
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Section>
    </>
  );
};
