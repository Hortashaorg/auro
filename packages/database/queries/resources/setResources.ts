import { type InferInsertModel, sql } from "drizzle-orm";
import { db, schema, type Transaction } from "@db/mod.ts";
import { throwError } from "@package/common";

type SetResourceData = Omit<
  InferInsertModel<typeof schema.resource>,
  "createdAt" | "updatedAt"
>;

export const setResources = async (
  data: SetResourceData[],
  tx?: Transaction,
) => {
  const transaction = tx ?? db;
  return await transaction
    .insert(schema.resource)
    .values(data)
    .onConflictDoUpdate({
      target: schema.resource.id,
      set: {
        assetId: sql`excluded.asset_id`,
        description: sql`excluded.description`,
        leaderboard: sql`excluded.leaderboard`,
        name: sql`excluded.name`,
        updatedAt: Temporal.Now.instant(),
      },
    })
    .returning();
};

export const setResource = async (
  data: SetResourceData,
  tx?: Transaction,
) => {
  const resources = await setResources([data], tx);
  return resources[0] ?? throwError("Resource should exist");
};
