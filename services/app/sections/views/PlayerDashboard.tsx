import type { InferSelectModel, schema } from "@package/database";
import { Text } from "@comp/content/Text.tsx";
import { Section } from "@comp/layout/Section.tsx";
import { Grid } from "@comp/layout/Grid.tsx";
import { Card } from "@comp/display/card/Card.tsx";
import { CardContent } from "@comp/display/card/CardContent.tsx";
import { CardImage } from "@comp/display/card/CardImage.tsx";
import { getServerActions } from "../../queries/serverActions.ts";
import { Button } from "@comp/inputs/Button.tsx";
import { ResourcesTable } from "./ResourcesTable.tsx";
import { currentUser } from "@queries/currentUser.ts";

const calculateTimeUntilNextAction = (
  actionRecoveryInterval: InferSelectModel<
    typeof schema.server
  >["actionRecoveryInterval"],
) => {
  const current = Temporal.Now.plainDateTimeISO();

  const minutes: Record<typeof actionRecoveryInterval, number> = {
    "5min": 5,
    "15min": 15,
    "30min": 30,
    "1hour": 60,
    "2hour": 120,
    "4hour": 240,
    "8hour": 480,
    "12hour": 720,
    "1day": 1440,
  } as const;

  const minUntilNextAction = minutes[actionRecoveryInterval] -
    current.minute % minutes[actionRecoveryInterval];

  if (minUntilNextAction === 1 && current.second > 0) {
    return "less than a minute";
  }

  if (minUntilNextAction <= 60) {
    return `${minUntilNextAction} minute${minUntilNextAction > 1 ? "s" : ""}`;
  }

  const hoursUntilNextAction = Math.floor(minUntilNextAction / 60);
  return `${hoursUntilNextAction} hour${hoursUntilNextAction > 1 ? "s" : ""}`;
};

export const PlayerDashboard = async (
  { server }: { server: InferSelectModel<typeof schema.server> },
) => {
  const actions = await getServerActions(server.id);
  const user = await currentUser(server.id);

  return (
    <>
      <Text>
        Welcome to {server.name}
      </Text>

      <ResourcesTable serverId={server.id} />

      <Section>
        <Text variant="h2">Actions</Text>
        <Text variant="body">
          You have {user.availableActions} available actions
        </Text>
        <Text variant="body">
          More available actions in:{" "}
          {calculateTimeUntilNextAction(server.actionRecoveryInterval)}
        </Text>

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
