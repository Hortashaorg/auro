import { throwError } from "@package/common";
import { serverAndUser } from "@queries/user/serverAndUser.ts";
import { Title } from "@comp/atoms/typography/index.ts";
import { Grid, Section } from "@comp/atoms/layout/index.ts";
import { Card, CardBody } from "@comp/atoms/card/index.ts";
import { MediaCardHeader } from "@comp/molecules/card/index.ts";
import { getServerActions } from "@queries/action/serverActions.ts";
import { Button } from "@comp/atoms/buttons/index.ts";
import { CardActions } from "@comp/atoms/card/CardActions.tsx";
import { type FC, getGlobalContext } from "@kalena/framework";
import { TimeUntilNextActionText } from "./TimeUntilNextActionText.section.tsx";

export const ActionsSection: FC = async (props) => {
  const context = getGlobalContext();
  const serverId = context.req.param("serverId") ??
    throwError("Server ID not found in route params");
  const email = context.var.email ?? throwError("Email not found");
  const { user, server } = await serverAndUser(serverId, email);
  const actions = await getServerActions(server.id);

  return (
    <Section id="player-actions-section" {...props}>
      <Title level="h2">Actions</Title>
      <TimeUntilNextActionText server={server} user={user} />

      <Grid>
        {actions.map((action) => (
          <Card key={action.id}>
            <CardBody>
              <MediaCardHeader
                title={action.name}
                description={action.description ?? undefined}
                imageSrc={action.assetUrl}
                imageAlt={`${action.name} icon`}
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
  );
};
