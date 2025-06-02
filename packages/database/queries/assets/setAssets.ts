import { type InferInsertModel, sql } from "drizzle-orm";
import { db, schema, type Transaction } from "@db/mod.ts";
import { throwError } from "@package/common";

type SetAssetData = Omit<
  InferInsertModel<typeof schema.asset>,
  "createdAt" | "updatedAt"
>;
export const setAssets = async (data: SetAssetData[], tx?: Transaction) => {
  const transaction = tx ?? db;
  return await transaction
    .insert(schema.asset)
    .values(data)
    .onConflictDoUpdate({
      target: [schema.asset.id],
      set: {
        updatedAt: Temporal.Now.instant(),
        name: sql`excluded.name`,
        type: sql`excluded.type`,
        url: sql`excluded.url`,
      },
    })
    .returning();
};

export const setAsset = async (data: SetAssetData, tx?: Transaction) => {
  const assets = await setAssets([data], tx);
  return assets[0] ?? throwError("Asset should exist");
};
