import { getGlobalContext, type JSX } from "@kalena/framework";
import { throwError } from "@package/common";
import { db, eq, schema } from "@package/database";
import { Grid, HtmxWrapper } from "@comp/wrappers/index.ts";
import { Card, CardImage } from "@comp/atoms/card/index.ts";
import { CardContent } from "@comp/molecules/card/index.ts";
import { Text } from "@comp/typography/index.ts";

type Props = JSX.IntrinsicElements["div"];

export const LocationGrid = async ({ ...props }: Props) => {
  const globalContext = getGlobalContext();
  const serverId = globalContext.req.param("serverId");

  if (!serverId) throwError("No serverId");

  const locations = await db.select({
    url: schema.asset.url,
    name: schema.location.name,
    id: schema.location.id,
  }).from(schema.location)
    .innerJoin(schema.asset, eq(schema.location.assetId, schema.asset.id))
    .where(
      eq(schema.location.serverId, serverId),
    );

  return (
    <HtmxWrapper {...props} id="location-section">
      <Grid>
        {locations.map((location) => (
          <LocationCard key={location.id} location={location} />
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
  };
}) => {
  return (
    <Card className="w-3xs">
      <CardImage src={location.url} alt={location.name} />
      <CardContent title={location.name}>
        <Text variant="h1" className="text-xl font-bold truncate">
          {location.name}
        </Text>
      </CardContent>
    </Card>
  );
};
