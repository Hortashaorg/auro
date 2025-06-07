import type { FC } from "@kalena/framework";
import { Card } from "@comp/atoms/card/index.ts";
import { MediaCardHeader } from "@comp/molecules/card/index.ts";
import { Grid, HtmxWrapper } from "@comp/atoms/layout/index.ts";
import type { BaseComponentProps } from "@comp/utils/props.ts";
import { queries } from "@package/database";

type Props = {
  gameId: string;
} & BaseComponentProps;

export const ItemGrid: FC<Props> = async ({ gameId, ...props }) => {
  const itemsData = await queries.items.getItemsByGameId(gameId);

  return (
    <HtmxWrapper {...props} id="item-section">
      <Grid>
        {itemsData.map(({ item, asset }) => (
          <ItemCard
            key={item.id}
            item={{
              id: item.id,
              name: item.name,
              url: asset.url,
              description: item.description ?? undefined,
              rarity: item.rarity,
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
      <MediaCardHeader
        title={item.name}
        description={item.description}
        imageSrc={item.url}
        imageAlt={`${item.name} icon`}
      />
    </Card>
  );
};
