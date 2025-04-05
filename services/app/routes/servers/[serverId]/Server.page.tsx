import { Layout } from "@layout/Layout.tsx";
import { createRoute } from "@kalena/framework";
import { throwError } from "@package/common";
import { hasAccessToServer } from "@permissions/index.ts";
import { serverAndUser } from "@queries/user/serverAndUser.ts";
import { Text, Title } from "@comp/atoms/typography/index.ts";
import { Grid, Section } from "@comp/atoms/layout/index.ts";
import { Card, CardBody } from "@comp/atoms/card/index.ts";
import { MediaCardHeader } from "@comp/molecules/card/index.ts";
import { getServerActions } from "@queries/action/serverActions.ts";
import { Button } from "@comp/atoms/buttons/index.ts";
import { ResourcesTable } from "./ResourcesTable.section.tsx";
import type { InferSelectModel, schema } from "@package/database";
import { CardActions } from "@comp/atoms/card/CardActions.tsx";

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

  const timeLeft = Temporal.Now.plainDateTimeISO().until(
    Temporal.Now.plainDateTimeISO().add({
      minutes: minUntilNextAction,
    }),
  );

  if (timeLeft.hours > 1) {
    return `${timeLeft.hours} hours`;
  }

  if (timeLeft.hours === 1 && timeLeft.minutes > 0) {
    return `${timeLeft.hours} hour`;
  }

  if (timeLeft.minutes > 1) {
    return `${timeLeft.minutes} minutes`;
  }

  return "less than a minute";
};

const Server = async () => {
  const context = await serverRoute.customContext();
  const server = context.server;
  const user = context.user;
  const actions = await getServerActions(server.id);

  return (
    <Layout title={`Server - ${server.name}`}>
      <Text>
        Welcome to {server.name}
      </Text>

      <ResourcesTable serverId={server.id} />

      <Section>
        <Title level="h2">Actions</Title>
        <Text>
          You have {user.availableActions} available actions
        </Text>
        <Text>
          More available actions in:{" "}
          {calculateTimeUntilNextAction(server.actionRecoveryInterval)}
        </Text>

        <Grid>
          {actions.map((action) => (
            <Card>
              <CardBody>
                <MediaCardHeader
                  title={action.name}
                  description={action.description ?? undefined}
                  imageSrc={action.assetUrl}
                  imageAlt={action.name}
                />
              </CardBody>
              <CardActions>
                <Button
                  hx-post={`/api/servers/${server.id}/actions/${action.id}/execute`}
                  hx-swap="none"
                >
                  Do it!
                </Button>
              </CardActions>
            </Card>
          ))}
        </Grid>
      </Section>
    </Layout>
  );
};

export const serverRoute = createRoute({
  path: "/servers/:serverId",
  component: Server,
  permission: {
    check: hasAccessToServer,
    redirectPath: "/servers",
  },
  partial: false,
  hmr: Deno.env.get("ENV") === "local",
  customContext: (c) => {
    const serverId = c.req.param("serverId");
    const email = c.var.email ?? throwError("Email not found");

    return serverAndUser(serverId, email);
  },
});
