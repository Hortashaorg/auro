import { db, eq, schema } from "@package/database";
import { getGlobalContext } from "@kalena/framework";
import { throwError } from "@package/common";
import { Card } from "@comp/layout/Card.tsx";
import { Grid } from "@comp/layout/Grid.tsx";
import { Flex } from "@comp/layout/Flex.tsx";
import { Text } from "@comp/content/Text.tsx";
import { Img } from "@comp/content/Img.tsx";
import { HtmxWrapper } from "@comp/layout/HtmxWrapper.tsx";
import { Badge } from "@comp/content/Badge.tsx";

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
  const rarityColors = {
    common: "default",
    uncommon: "success",
    rare: "secondary",
    epic: "warning",
    legendary: "danger",
  } as const;

  return (
    <Card className="group hover:ring-2 hover:ring-primary-500 transition-all">
      <div className="aspect-square overflow-hidden">
        <Img
          src={item.url}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4 space-y-4">
        <Flex justify="between" items="start" gap="md">
          <div className="flex-1">
            <Text variant="h1" className="text-xl font-bold truncate">
              {item.name}
            </Text>
            {item.description && (
              <Text
                variant="body"
                className="text-sm text-text-500 dark:text-text-400 line-clamp-2"
              >
                {item.description}
              </Text>
            )}
          </div>
        </Flex>

        <Badge variant={rarityColors[item.rarity]}>
          {item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1)}
        </Badge>
      </div>
    </Card>
  );
};
