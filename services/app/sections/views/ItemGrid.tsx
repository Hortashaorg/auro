import { db, eq, schema } from "@package/database";
import { getGlobalContext } from "@kalena/framework";
import { throwError } from "@package/common";
import { Card } from "@comp/atoms/card/index.ts";
import { MediaCardHeader } from "@comp/molecules/card/index.ts";
import { Grid, HtmxWrapper } from "@comp/wrappers/index.ts";

type Props = {
  id?: string;
  className?: string;
};

export const ItemGrid = async ({ ...props }: Props) => {
  const globalContext = getGlobalContext();
  const serverId = globalContext.req.param("serverId");

  if (!serverId) throwError("No serverId");

  const items = await db.select({
    url: schema.asset.url,
    name: schema.item.name,
    id: schema.item.id,
    description: schema.item.description,
    rarity: schema.item.rarity,
  }).from(schema.item)
    .innerJoin(schema.asset, eq(schema.item.assetId, schema.asset.id))
    .where(
      eq(schema.item.serverId, serverId),
    );

  return (
    <HtmxWrapper {...props} id="item-section">
      <Grid>
        {items.map((item) => (
          <ItemCard
            key={item.id}
            item={{
              ...item,
              description: item.description ?? undefined,
            }}
          />
        ))}
      </Grid>
    </HtmxWrapper>
  );
};

const ItemCard = ({ item }: {
  item: {
    id: string;
    name: string;
    url: string;
    description?: string;
    rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  };
}) => {
  return (
    <Card className="w-3xs">
      <MediaCardHeader
        title={item.name}
        description={item.description}
        imageSrc={item.url}
        imageAlt={item.name}
      />
    </Card>
  );
};
