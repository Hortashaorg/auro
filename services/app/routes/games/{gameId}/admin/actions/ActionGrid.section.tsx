import type { FC } from "@kalena/framework";
import { Grid, HtmxWrapper } from "@comp/atoms/layout/index.ts";
import { Card, CardBody } from "@comp/atoms/card/index.ts";
import { Badge, Icon } from "@comp/atoms/typography/index.ts";
import { ButtonLink } from "@comp/atoms/buttons/index.ts";
import { selectBaseGameActions } from "@queries/selects/actions/selectGameActions.ts";
import { MediaCardHeader } from "@comp/molecules/card/index.ts";
import { CardActions } from "@comp/atoms/card/CardActions.tsx";
import type { BaseComponentProps } from "@comp/utils/props.ts";

type Props = {
  gameId: string;
} & BaseComponentProps;

export const ActionGrid: FC<Props> = async ({ gameId, ...props }) => {
  const actionsData = await selectBaseGameActions(gameId);

  return (
    <HtmxWrapper {...props} id="action-section">
      <Grid items="stretch">
        {actionsData.map(({ action, asset, location }) => (
          <ActionCard
            key={action.id}
            action={{
              id: action.id,
              name: action.name,
              description: action.description || undefined,
              cooldownMinutes: action.cooldownMinutes,
              repeatable: action.repeatable,
              assetUrl: asset.url,
              locationName: location?.name ?? null,
            }}
            gameId={gameId}
          />
        ))}
      </Grid>
    </HtmxWrapper>
  );
};

const ActionCard = ({ action, gameId }: {
  action: {
    id: string;
    name: string;
    description?: string;
    cooldownMinutes: number;
    repeatable: boolean;
    assetUrl: string;
    locationName: string | null;
  };
  gameId: string;
}) => {
  return (
    <Card>
      <MediaCardHeader
        title={action.name}
        description={action.description}
        imageSrc={action.assetUrl}
        imageAlt={`${action.name} icon`}
      />
      <CardBody>
        <div className="flex flex-wrap gap-2">
          <Badge variant="warning" className="flex items-center gap-1">
            <Icon icon="clock" variant="none" />
            {action.cooldownMinutes}m cooldown
          </Badge>
          <Badge
            variant={action.repeatable ? "success" : "danger"}
            className="flex items-center gap-1"
          >
            {action.repeatable
              ? <Icon icon="repeat" variant="none" />
              : <Icon icon="x" variant="none" />}
            {action.repeatable ? "Repeatable" : "One-time"}
          </Badge>
          {action.locationName && (
            <Badge variant="default" className="flex items-center gap-1">
              <Icon icon="map-pin" variant="none" />
              {action.locationName}
            </Badge>
          )}
        </div>
      </CardBody>
      <CardActions>
        <ButtonLink
          href={`/games/${gameId}/admin/actions/${action.id}`}
        >
          Configure
        </ButtonLink>
      </CardActions>
    </Card>
  );
};
