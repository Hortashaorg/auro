import { type InferInsertModel, sql } from "drizzle-orm";
import {
  catchConstraintByName,
  db,
  schema,
  type Transaction,
} from "@db/mod.ts";
import { throwError } from "@package/common";

type SetAssetData = Omit<
  InferInsertModel<typeof schema.asset>,
  "createdAt" | "updatedAt"
>;
export const setAssets = async (data: SetAssetData[], tx?: Transaction) => {
  const transaction = tx ?? db;
  try {
    return await transaction
      .insert(schema.asset)
      .values(data)
      .onConflictDoUpdate({
        target: [schema.asset.id],
        set: {
          name: sql`excluded.name`,
          type: sql`excluded.type`,
          url: sql`excluded.url`,
          updatedAt: Temporal.Now.instant(),
        },
      })
      .returning();
  } catch (error) {
    if (catchConstraintByName(error, "asset_name_unique")) {
      return await transaction
        .insert(schema.asset)
        .values(data)
        .onConflictDoUpdate({
          target: [schema.asset.name],
          set: {
            name: sql`excluded.name`,
            type: sql`excluded.type`,
            url: sql`excluded.url`,
            updatedAt: Temporal.Now.instant(),
          },
        })
        .returning();
    }
    if (catchConstraintByName(error, "asset_url_unique")) {
      return await transaction
        .insert(schema.asset)
        .values(data)
        .onConflictDoUpdate({
          target: [schema.asset.name],
          set: {
            name: sql`excluded.name`,
            type: sql`excluded.type`,
            url: sql`excluded.url`,
            updatedAt: Temporal.Now.instant(),
          },
        })
        .returning();
    }
    console.error(error);
    throw error;
  }
};

export const setAsset = async (data: SetAssetData, tx?: Transaction) => {
  const assets = await setAssets([data], tx);
  return assets[0] ?? throwError("Asset should exist");
};
