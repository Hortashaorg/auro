import { getGlobalContext, type JSX } from "@kalena/framework";
import { throwError } from "@package/common";
import { db, eq, schema } from "@package/database";
import { HtmxWrapper } from "@comp/layout/HtmxWrapper.tsx";
import { Card } from "@comp/display/card/Card.tsx";
import { CardContent } from "@comp/display/card/CardContent.tsx";
import { CardImage } from "@comp/display/card/CardImage.tsx";
import { Text } from "@comp/content/Text.tsx";
import { Badge } from "@comp/content/Badge.tsx";
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
      <Grid gap="lg" content="small">
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
    <Card>
      <CardImage src={action.assetUrl} alt={action.name} />

      <CardContent title={action.name}>
        {action.description && (
          <Text
            variant="body"
            className="text-sm text-text-500 dark:text-text-400 line-clamp-2"
          >
            {action.description}
          </Text>
        )}
        <div className="flex flex-wrap gap-2">
          <Badge variant="warning" className="flex items-center gap-1">
            <i data-lucide="clock" width={16} height={16}></i>
            {action.cooldownMinutes}m cooldown
          </Badge>
          <Badge
            variant={action.repeatable ? "success" : "danger"}
            className="flex items-center gap-1"
          >
            {action.repeatable
              ? <i data-lucide="repeat" width={16} height={16}></i>
              : <i data-lucide="x" width={16} height={16}></i>}
            {action.repeatable ? "Repeatable" : "One-time"}
          </Badge>
          {action.locationName && (
            <Badge variant="default" className="flex items-center gap-1">
              <i data-lucide="map-pin" width={16} height={16}></i>
              {action.locationName}
            </Badge>
          )}
        </div>

        <ButtonLink
          href={`/servers/${serverId}/actions/${action.id}`}
        >
          Configure
        </ButtonLink>
      </CardContent>
    </Card>
  );
};
