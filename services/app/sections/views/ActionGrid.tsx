import { getGlobalContext, type JSX } from "@kalena/framework";
import { throwError } from "@package/common";
import { db, eq, schema } from "@package/database";
import { HtmxWrapper } from "@comp/layout/HtmxWrapper.tsx";
import { Card } from "@comp/layout/Card.tsx";
import { Text } from "@comp/content/Text.tsx";
import { Badge } from "@comp/content/Badge.tsx";
import { Img } from "@comp/content/Img.tsx";
import { Flex } from "@comp/layout/Flex.tsx";
import { Grid } from "@comp/layout/Grid.tsx";
import { ButtonLink } from "@comp/navigation/ButtonLink.tsx";
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
      <Grid gap="lg" content="medium">
        {actions.map((action) => (
          <ActionCard
            key={action.id}
            action={{
              ...action,
              description: action.description || undefined,
            }}
            serverId={serverId}
          />
        ))}
      </Grid>
    </HtmxWrapper>
  );
};

const ActionCard = ({ action, serverId }: {
  action: {
    id: string;
    name: string;
    description?: string;
    cooldownMinutes: number;
    repeatable: boolean;
    assetUrl: string;
    locationName: string | null;
  };
  serverId: string;
}) => {
  return (
    <Card className="group hover:ring-2 hover:ring-primary-500 transition-all">
      <div className="aspect-square overflow-hidden">
        <Img
          src={action.assetUrl}
          alt={action.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4 space-y-4">
        <Flex justify="between" items="start" className="gap-4">
          <div className="space-y-2 flex-1">
            <Text variant="h1" className="text-xl font-bold truncate">
              {action.name}
            </Text>
            {action.description && (
              <Text
                variant="body"
                className="text-sm text-text-500 dark:text-text-400 line-clamp-2"
              >
                {action.description}
              </Text>
            )}
          </div>
        </Flex>

        <div className="flex flex-wrap gap-2">
          <Badge variant="warning" className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            {action.cooldownMinutes}m cooldown
          </Badge>
          <Badge
            variant={action.repeatable ? "success" : "danger"}
            className="flex items-center gap-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              {action.repeatable
                ? (
                  <path d="M17 2l4 4-4 4M3 11v-1a4 4 0 0 1 4-4h14M7 22l-4-4 4-4M21 13v1a4 4 0 0 1-4 4H3" />
                )
                : <path d="M18 6L6 18M6 6l12 12" />}
            </svg>
            {action.repeatable ? "Repeatable" : "One-time"}
          </Badge>
          {action.locationName && (
            <Badge variant="default" className="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {action.locationName}
            </Badge>
          )}
        </div>

        <ButtonLink
          href={`/servers/${serverId}/action/${action.id}`}
          variant="primary"
          width="full"
        >
          Configure
        </ButtonLink>
      </div>
    </Card>
  );
};
