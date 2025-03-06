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
      <Grid gap="lg" content="medium">
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
    <Card>
      <CardImage src={item.url} alt={item.name} />
      <CardContent title={item.name}>
        {item.description && (
          <Text variant="body">
            {item.description}
          </Text>
        )}
      </CardContent>
    </Card>
  );
};
