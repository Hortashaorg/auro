import type { FC } from "@kalena/framework";
import { selectResourcesByGameId } from "@queries/selects/resources/selectResourcesByGameId.ts";
import { Card } from "@comp/atoms/card/index.ts";
import { MediaCardHeader } from "@comp/molecules/card/index.ts";
import { Grid, HtmxWrapper } from "@comp/atoms/layout/index.ts";
import type { BaseComponentProps } from "@comp/utils/props.ts";

type Props = {
  gameId: string;
} & BaseComponentProps;

export const ResourceGrid: FC<Props> = async ({ gameId, ...props }) => {
  const resourcesData = await selectResourcesByGameId(gameId);

  return (
    <HtmxWrapper {...props} id="resource-section">
      <Grid>
        {resourcesData.map(({ resource, asset }) => (
          <ResourceCard
            key={resource.id}
            resource={{
              id: resource.id,
              name: resource.name,
              url: asset.url,
              description: resource.description,
            }}
          />
        ))}
      </Grid>
    </HtmxWrapper>
  );
};

const ResourceCard = ({ resource }: {
  resource: {
    id: string;
    name: string;
    url: string;
    description: string | null;
  };
}) => {
  return (
    <Card>
      <MediaCardHeader
        title={resource.name}
        description={resource.description ?? undefined}
        imageSrc={resource.url}
        imageAlt={`${resource.name} icon`}
      />
    </Card>
  );
};
