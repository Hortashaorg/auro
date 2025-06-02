import { type InferInsertModel, sql } from "drizzle-orm";
import { db, schema, type Transaction } from "@db/mod.ts";
import { throwError } from "@package/common";

type SetLocationData = Omit<
  InferInsertModel<typeof schema.location>,
  "createdAt" | "updatedAt"
>;

export const setLocations = async (
  data: SetLocationData[],
  tx?: Transaction,
) => {
  const transaction = tx ?? db;
  return await transaction
    .insert(schema.location)
    .values(data)
    .onConflictDoUpdate({
      target: [schema.location.id],
      set: {
        assetId: sql`excluded.asset_id`,
        description: sql`excluded.description`,
        gameId: sql`excluded.game_id`,
        name: sql`excluded.name`,
        isStarterLocation: sql`excluded.is_starter_location`,
        updatedAt: Temporal.Now.instant(),
      },
    })
    .returning();
};

export const setLocation = async (
  data: SetLocationData,
  tx?: Transaction,
) => {
  const locations = await setLocations([data], tx);
  return locations[0] ?? throwError("Location should exist");
};
