import { db, eq, schema } from "@package/database";
import { getGlobalContext } from "@kalena/framework";
import { throwError } from "@package/common";
import { Card } from "@comp/layout/Card.tsx";
import { Grid } from "@comp/layout/Grid.tsx";
import { Flex } from "@comp/layout/Flex.tsx";
import { Text } from "@comp/content/Text.tsx";
import { Img } from "@comp/content/Img.tsx";
import { HtmxWrapper } from "@comp/layout/HtmxWrapper.tsx";

type Props = {
  id?: string;
  className?: string;
};

export const ResourceGrid = async ({ ...props }: Props) => {
  const globalContext = getGlobalContext();
  const serverId = globalContext.req.param("serverId");

  if (!serverId) throwError("No serverId");

  const resources = await db.select({
    url: schema.asset.url,
    name: schema.resource.name,
    id: schema.resource.id,
  }).from(schema.resource)
    .innerJoin(schema.asset, eq(schema.resource.assetId, schema.asset.id))
    .where(
      eq(schema.resource.serverId, serverId),
    );

  return (
    <HtmxWrapper {...props} id="resource-section">
      <Grid gap="lg" content="medium">
        {resources.map((resource) => (
          <ResourceCard key={resource.id} resource={resource} />
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
  };
}) => {
  return (
    <Card className="group hover:ring-2 hover:ring-primary-500 transition-all">
      <div className="aspect-square overflow-hidden">
        <Img
          src={resource.url}
          alt={resource.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4">
        <Flex justify="between" items="start" gap="md">
          <div className="flex-1">
            <Text variant="h1" className="text-xl font-bold truncate">
              {resource.name}
            </Text>
          </div>
        </Flex>
      </div>
    </Card>
  );
};
