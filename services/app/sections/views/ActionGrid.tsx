import { getGlobalContext, type JSX } from "@kalena/framework";
import { throwError } from "@package/common";
import { Grid, HtmxWrapper } from "@comp/wrappers/index.ts";
import { Card, CardBody } from "@comp/atoms/card/index.ts";
import { Badge } from "@comp/atoms/typography/index.ts";
import { ButtonLink } from "@comp/atoms/buttons/index.ts";
import { getServerActions } from "@queries/serverActions.ts";
import { MediaCardHeader } from "@comp/molecules/card/index.ts";

type Props = JSX.IntrinsicElements["div"];

export const ActionGrid = async ({ ...props }: Props) => {
  const globalContext = getGlobalContext();
  const serverId = globalContext.req.param("serverId");

  if (!serverId) throwError("No serverId");

  const actions = await getServerActions(serverId);

  return (
    <HtmxWrapper {...props} id="action-section">
      <Grid>
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
      <MediaCardHeader
        title={action.name}
        description={action.description}
        imageSrc={action.assetUrl}
        imageAlt={action.name}
      />
      <CardBody>
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
      </CardBody>
    </Card>
  );
};
