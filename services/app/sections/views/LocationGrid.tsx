import { getGlobalContext, type JSX } from "@kalena/framework";
import { throwError } from "@package/common";
import { db, eq, schema } from "@package/database";
import { HtmxWrapper } from "@comp/layout/HtmxWrapper.tsx";
import { Grid } from "@comp/layout/Grid.tsx";
import { Card } from "@comp/display/card/Card.tsx";
import { CardContent } from "@comp/display/card/CardContent.tsx";
import { CardImage } from "@comp/display/card/CardImage.tsx";
import { Text } from "@comp/content/Text.tsx";

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
      <Grid gap="lg" content="medium">
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
    <Card className="group hover:ring-2 hover:ring-primary-500 transition-all">
      <CardImage src={location.url} alt={location.name} />
      <CardContent title={location.name}>
        <Text variant="h1" className="text-xl font-bold truncate">
          {location.name}
        </Text>
      </CardContent>
    </Card>
  );
};
