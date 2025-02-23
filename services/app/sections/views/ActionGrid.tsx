import { getGlobalContext, type JSX } from "@kalena/framework";
import { throwError } from "@package/common";
import { db, eq, schema } from "@package/database";
import { HtmxWrapper } from "@comp/layout/HtmxWrapper.tsx";
import { Grid } from "@comp/layout/Grid.tsx";
import { Card } from "@comp/layout/Card.tsx";
import { Flex } from "@comp/layout/Flex.tsx";
import { Text } from "@comp/content/Text.tsx";
import { Badge } from "@comp/content/Badge.tsx";
import { Img } from "@comp/content/Img.tsx";

type Props = JSX.IntrinsicElements["div"];

export const ActionGrid = async ({ ...props }: Props) => {
  const globalContext = getGlobalContext();
  const serverId = globalContext.req.param("serverId");

  if (!serverId) throwError("No serverId");

  const actions = await db.select({
    id: schema.action.id,
    name: schema.action.name,
    description: schema.action.description,
    cooldownMinutes: schema.action.cooldownMinutes,
    repeatable: schema.action.repeatable,
    assetUrl: schema.asset.url,
    locationName: schema.location.name,
  }).from(schema.action)
    .innerJoin(schema.asset, eq(schema.action.assetId, schema.asset.id))
    .leftJoin(schema.location, eq(schema.action.locationId, schema.location.id))
    .where(
      eq(schema.action.serverId, serverId),
    );

  return (
    <HtmxWrapper {...props} id="action-section">
      <Grid gap="md" content="medium">
        {actions.map((action) => (
          <ActionCard
            key={action.id}
            action={{
              ...action,
              description: action.description || undefined,
            }}
          />
        ))}
      </Grid>
    </HtmxWrapper>
  );
};

const ActionCard = ({ action }: {
  action: {
    id: string;
    name: string;
    description?: string;
    cooldownMinutes: number;
    repeatable: boolean;
    assetUrl: string;
    locationName: string | null;
  };
}) => {
  return (
    <Card className="p-4 space-y-4">
      <Flex justify="between" items="start">
        <div className="flex-1">
          <Text variant="h1" className="text-xl truncate mr-2">
            {action.name}
          </Text>
          {action.description && (
            <Text variant="body" className="text-sm text-gray-500 mt-1">
              {action.description}
            </Text>
          )}
          <div className="mt-2 space-x-2">
            <Badge variant="warning">
              {action.cooldownMinutes}m cooldown
            </Badge>
            <Badge variant={action.repeatable ? "success" : "danger"}>
              {action.repeatable ? "Repeatable" : "One-time"}
            </Badge>
            {action.locationName && (
              <Badge variant="default">
                {action.locationName}
              </Badge>
            )}
          </div>
        </div>
        <div className="w-16 h-16 flex-shrink-0">
          <Img
            src={action.assetUrl}
            alt={action.name}
            className="w-full h-full object-cover rounded"
          />
        </div>
      </Flex>
    </Card>
  );
};
