import { Text, Title } from "@comp/atoms/typography/index.ts";
import { Flex, Grid, Section } from "@comp/atoms/layout/index.ts";
import { Card, CardBody } from "@comp/atoms/card/index.ts";
import { MediaCardHeader } from "@comp/molecules/card/index.ts";
import { selectUserGameActions } from "@queries/selects/actions/selectGameActions.ts";
import { Button } from "@comp/atoms/buttons/index.ts";
import { CardActions } from "@comp/atoms/card/CardActions.tsx";
import { type FC, getGlobalContext } from "@kalena/framework";
import type { BaseComponentProps } from "@comp/utils/props.ts";
import { TimeUntilNextActionText } from "./TimeUntilNextActionText.section.tsx";
import { throwError } from "@package/common";

type Props = {
  gameId: string;
  userId: string;
} & BaseComponentProps;

export const ActionsSection: FC<Props> = async (
  { gameId, userId, ...props },
) => {
  const actionData = await selectUserGameActions(
    gameId,
    userId,
  );

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
        {actionData.map((data) => (
          <Card key={data.action.id}>
            <CardBody>
              <MediaCardHeader
                title={data.action.name}
                description={data.action.description ?? undefined}
                imageSrc={data.asset.url}
                imageAlt={`${data.action.name} icon`}
              />

              {data.costs && data.costs.length > 0 && (
                <Flex direction="col" gap="sm" marginTop="md">
                  <Text variant="strong">Costs:</Text>
                  <Flex gap="md" wrap="wrap">
                    {data.costs.map((cost) => (
                      <Flex
                        key={cost.resource.id}
                        gap="sm"
                        align="center"
                      >
                        <img
                          src={cost.resourceAsset.url}
                          alt={cost.resource.name}
                          width="24"
                          height="24"
                          style={{ objectFit: "cover" }}
                        />
                        <Text variant={!data.canExecute ? "error" : "body"}>
                          {`${cost.cost} (${cost.userQuantity})`}
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
                disabled={!data.canExecute}
                title={!data.canExecute
                  ? "You don't have enough resources"
                  : "Perform Action"}
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
