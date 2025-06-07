import type { JSX } from "@kalena/framework";
import { Grid, HtmxWrapper } from "@comp/atoms/layout/index.ts";
import { Card } from "@comp/atoms/card/index.ts";
import { MediaCardHeader } from "@comp/molecules/card/index.ts";
import { queries } from "@package/database";

type Props = {
  gameId: string;
} & JSX.IntrinsicElements["div"];

export const LocationGrid = async ({ gameId, ...props }: Props) => {
  const locationData = await queries.locations.getLocationsByGameId(gameId);

  return (
    <HtmxWrapper {...props} id="location-section">
      <Grid>
        {locationData.map((data) => (
          <LocationCard
            key={data.location.id}
            location={{
              id: data.location.id,
              name: data.location.name,
              url: data.asset.url,
              description: data.location.description ?? undefined,
            }}
          />
        ))}
      </Grid>
    </HtmxWrapper>
  );
};

const LocationCard = ({ location }: {
  location: {
    id: string;
    name: string;
    url: string;
    description?: string;
  };
}) => {
  return (
    <Card>
      <MediaCardHeader
        title={location.name}
        description={location.description}
        imageSrc={location.url}
        imageAlt={`${location.name} icon`}
      />
    </Card>
  );
};
