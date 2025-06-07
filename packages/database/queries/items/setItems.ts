import { type InferInsertModel, sql } from "drizzle-orm";
import { db, schema, type Transaction } from "@db/mod.ts";
import { throwError } from "@package/common";

type SetItemData = Omit<
  InferInsertModel<typeof schema.item>,
  "createdAt" | "updatedAt"
>;

export const setItems = async (
  data: SetItemData[],
  tx?: Transaction,
) => {
  const transaction = tx ?? db;
  return await transaction
    .insert(schema.item)
    .values(data)
    .onConflictDoUpdate({
      target: schema.item.id,
      set: {
        name: sql`excluded.name`,
        stackable: sql`excluded.stackable`,
        description: sql`excluded.description`,
        assetId: sql`excluded.asset_id`,
        rarity: sql`excluded.rarity`,
        updatedAt: Temporal.Now.instant(),
      },
    })
    .returning();
};

export const setItem = async (
  data: SetItemData,
  tx?: Transaction,
) => {
  const items = await setItems([data], tx);
  return items[0] ?? throwError("Item should exist");
};
