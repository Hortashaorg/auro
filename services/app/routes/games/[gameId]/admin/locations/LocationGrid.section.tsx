import { getGlobalContext, type JSX } from "@kalena/framework";
import { throwError } from "@package/common";
import { db, eq, schema } from "@package/database";
import { Grid, HtmxWrapper } from "@comp/atoms/layout/index.ts";
import { Card } from "@comp/atoms/card/index.ts";
import { MediaCardHeader } from "@comp/molecules/card/index.ts";

type Props = JSX.IntrinsicElements["div"];

export const LocationGrid = async ({ ...props }: Props) => {
  const globalContext = getGlobalContext();
  const gameId = globalContext.req.param("gameId");

  if (!gameId) throwError("No gameId");

  const locations = await db.select({
    url: schema.asset.url,
    name: schema.location.name,
    id: schema.location.id,
    description: schema.location.description,
  }).from(schema.location)
    .innerJoin(schema.asset, eq(schema.location.assetId, schema.asset.id))
    .where(
      eq(schema.location.gameId, gameId),
    );

  return (
    <HtmxWrapper {...props} id="location-section">
      <Grid>
        {locations.map((location) => (
          <LocationCard
            key={location.id}
            location={{
              ...location,
              description: location.description ?? undefined,
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
