import { db, eq, schema } from "@package/database";
import { getGlobalContext } from "@kalena/framework";
import { throwError } from "@package/common";
import { Card } from "@comp/atoms/card/index.ts";
import { MediaCardHeader } from "@comp/molecules/card/index.ts";
import { Grid, HtmxWrapper } from "@comp/atoms/layout/index.ts";

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
    description: schema.resource.description,
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
