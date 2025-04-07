import { throwError } from "@package/common";
import { serverAndUser } from "@queries/user/serverAndUser.ts";
import { Text, Title } from "@comp/atoms/typography/index.ts";
import { Flex, Grid, Section } from "@comp/atoms/layout/index.ts";
import { Card, CardBody } from "@comp/atoms/card/index.ts";
import { MediaCardHeader } from "@comp/molecules/card/index.ts";
import { getServerActions } from "@queries/action/serverActions.ts";
import { Button } from "@comp/atoms/buttons/index.ts";
import { CardActions } from "@comp/atoms/card/CardActions.tsx";
import { type FC, getGlobalContext } from "@kalena/framework";
import { TimeUntilNextActionText } from "./TimeUntilNextActionText.section.tsx";

type ResourceCost = {
  actionId: string;
  resourceId: string;
  quantity: number;
  resourceName: string;
  resourceAssetUrl: string;
  userQuantity: number;
};

type ActionWithCosts = {
  id: string;
  name: string;
  description: string | null;
  cooldownMinutes: number;
  repeatable: boolean;
  assetUrl: string;
  locationName: string | null;
  costs: ResourceCost[];
  canExecute: boolean;
};

export const ActionsSection: FC = async (props) => {
  const context = getGlobalContext();
  const serverId = context.req.param("serverId") ??
    throwError("Server ID not found in route params");
  const email = context.var.email ?? throwError("Email not found");

  const { user, server } = await serverAndUser(serverId, email);
  const actions = await getServerActions(
    server.id,
    user.id,
  ) as ActionWithCosts[];

  return (
    <Section id="player-actions-section" {...props}>
      <Title level="h2">Actions</Title>
      <TimeUntilNextActionText server={server} user={user} />

      <Grid>
        {actions.map((action: ActionWithCosts) => (
          <Card key={action.id}>
            <CardBody>
              <MediaCardHeader
                title={action.name}
                description={action.description ?? undefined}
                imageSrc={action.assetUrl}
                imageAlt={`${action.name} icon`}
              />

              {action.costs && action.costs.length > 0 && (
                <Flex direction="col" gap="sm" marginTop="md">
                  <Text variant="strong">Costs:</Text>
                  <Flex gap="md" wrap="wrap">
                    {action.costs.map((cost: ResourceCost) => (
                      <Flex
                        key={cost.resourceId}
                        gap="sm"
                        align="center"
                      >
                        <img
                          src={cost.resourceAssetUrl}
                          alt={cost.resourceName}
                          width="24"
                          height="24"
                          style={{ objectFit: "cover" }}
                        />
                        <Text variant={!action.canExecute ? "error" : "body"}>
                          {`${cost.quantity} (${cost.userQuantity})`}
                        </Text>
                      </Flex>
                    ))}
                  </Flex>
                </Flex>
              )}
            </CardBody>
            <CardActions>
              <Button
                hx-post={`/api/servers/${server.id}/actions/${action.id}/execute`}
                hx-swap="none"
                disabled={!action.canExecute || user.availableActions <= 0}
                title={!action.canExecute
                  ? "You don't have enough resources"
                  : user.availableActions <= 0
                  ? "You have no actions left"
                  : undefined}
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
