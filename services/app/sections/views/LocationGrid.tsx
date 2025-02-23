import { getGlobalContext, type JSX } from "@kalena/framework";
import { throwError } from "@package/common";
import { db, eq, schema } from "@package/database";
import { HtmxWrapper } from "@comp/layout/HtmxWrapper.tsx";
import { Grid } from "@comp/layout/Grid.tsx";
import { Card } from "@comp/layout/Card.tsx";
import { Text } from "@comp/content/Text.tsx";
import { Img } from "@comp/content/Img.tsx";
import { Flex } from "@comp/layout/Flex.tsx";

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
      <div className="aspect-[16/9] overflow-hidden">
        <Img
          src={location.url}
          alt={location.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4">
        <Flex justify="between" items="start" className="gap-4">
          <div className="flex-1">
            <Text variant="h1" className="text-xl font-bold truncate">
              {location.name}
            </Text>
          </div>
        </Flex>
      </div>
    </Card>
  );
};
