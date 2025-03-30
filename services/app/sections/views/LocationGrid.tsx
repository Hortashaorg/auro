import { getGlobalContext, type JSX } from "@kalena/framework";
import { throwError } from "@package/common";
import { db, eq, schema } from "@package/database";
import { Grid } from "@comp/atoms/layout/index.ts";
import { HtmxWrapper } from "@comp/wrappers/index.ts";
import { Card } from "@comp/atoms/card/index.ts";
import { MediaCardHeader } from "@comp/molecules/card/index.ts";

type Props = JSX.IntrinsicElements["div"];

export const LocationGrid = async ({ ...props }: Props) => {
  const globalContext = getGlobalContext();
  const serverId = globalContext.req.param("serverId");

  if (!serverId) throwError("No serverId");

  const locations = await db.select({
    url: schema.asset.url,
    name: schema.location.name,
    id: schema.location.id,
    description: schema.location.description,
  }).from(schema.location)
    .innerJoin(schema.asset, eq(schema.location.assetId, schema.asset.id))
    .where(
      eq(schema.location.serverId, serverId),
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
    <Card className="w-3xs">
      <MediaCardHeader
        title={location.name}
        description={location.description}
        imageSrc={location.url}
        imageAlt={location.name}
      />
    </Card>
  );
};
