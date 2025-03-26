import { db, eq, schema } from "@package/database";
import { getGlobalContext } from "@kalena/framework";
import { throwError } from "@package/common";
import { Card } from "@comp/display/card/Card.tsx";
import { CardContent } from "@comp/display/card/CardContent.tsx";
import { CardImage } from "@comp/display/card/CardImage.tsx";
import { Grid } from "@comp/layout/Grid.tsx";
import { Text } from "@comp/content/Text.tsx";
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
      <Grid>
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
    <Card className="w-3xs">
      <CardImage src={resource.url} alt={resource.name} />
      <CardContent title={resource.name}>
        <Text variant="h1" className="text-xl font-bold truncate">
          {resource.name}
        </Text>
      </CardContent>
    </Card>
  );
};
