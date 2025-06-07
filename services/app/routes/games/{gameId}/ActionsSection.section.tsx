import { Text, Title } from "@comp/atoms/typography/index.ts";
import { Flex, Grid, Section } from "@comp/atoms/layout/index.ts";
import { Card, CardBody } from "@comp/atoms/card/index.ts";
import { MediaCardHeader } from "@comp/molecules/card/index.ts";
import { Button } from "@comp/atoms/buttons/index.ts";
import { CardActions } from "@comp/atoms/card/CardActions.tsx";
import { type FC, getGlobalContext } from "@kalena/framework";
import type { BaseComponentProps } from "@comp/utils/props.ts";
import { TimeUntilNextActionText } from "./TimeUntilNextActionText.section.tsx";
import { throwError } from "@package/common";
import { queries } from "@package/database";

type Props = {
  gameId: string;
  userId: string;
} & BaseComponentProps;

export const ActionsSection: FC<Props> = async (
  { gameId, userId, ...props },
) => {
  const actionData = await queries.actions.getActionsByGameId(gameId);
  const actionIds = actionData.map((data) => data.action.id);
  const costData = await queries.actions.getResourceCostsByActionIds(
    actionIds,
  );

  const userResources = await queries.users.getUserResourcesById(userId);

  const email = getGlobalContext().var.email ?? throwError(
    "Email not found in global context",
  );

  return (
    <Section id="player-actions-section" {...props}>
      <Title level="h2">Actions</Title>
      <TimeUntilNextActionText
        gameId={gameId}
        email={email}
      />

      <Grid>
        {actionData.map((data) => {
          const costs = costData.filter((c) =>
            c.action_resource_cost.actionId === data.action.id
          );

          let enoughResources = true;
          const costsAndUserResources = costs.map((cost) => {
            const userResource = userResources.find((a) =>
              a.resourceId === cost.resource.id
            );

            const userQuantity = userResource?.quantity ?? 0;
            if (cost.action_resource_cost.quantity > userQuantity) {
              enoughResources = false;
            }
            return {
              userResource,
              cost,
            };
          });

          return (
            <Card key={data.action.id}>
              <CardBody>
                <MediaCardHeader
                  title={data.action.name}
                  description={data.action.description ?? undefined}
                  imageSrc={data.asset.url}
                  imageAlt={`${data.action.name} icon`}
                />

                {costsAndUserResources.length > 0 && (
                  <Flex direction="col" gap="sm" marginTop="md">
                    <Text variant="strong">Costs:</Text>
                    <Flex gap="md" wrap="wrap">
                      {costsAndUserResources.map((data) => (
                        <Flex
                          key={data.cost.resource.id}
                          gap="sm"
                          align="center"
                        >
                          <img
                            src={data.cost.asset.url}
                            alt={data.cost.resource.name}
                            width="24"
                            height="24"
                            style={{ objectFit: "cover" }}
                          />
                          <Text variant={!enoughResources ? "error" : "body"}>
                            {`${data.cost.action_resource_cost.quantity} (${
                              data.userResource?.quantity ?? 0
                            })`}
                          </Text>
                        </Flex>
                      ))}
                    </Flex>
                  </Flex>
                )}
              </CardBody>
              <CardActions>
                <Button
                  hx-post={`/api/games/${gameId}/actions/${data.action.id}/execute`}
                  hx-swap="none"
                  disabled={!enoughResources}
                  title={!enoughResources
                    ? "You don't have enough resources"
                    : "Perform Action"}
                >
                  Do it!
                </Button>
              </CardActions>
            </Card>
          );
        })}
      </Grid>
    </Section>
  );
};
