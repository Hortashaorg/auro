import { type InferInsertModel, sql } from "drizzle-orm";
import { db, schema, type Transaction } from "@db/mod.ts";
import { throwError } from "@package/common";

type SetActionData = Omit<
  InferInsertModel<typeof schema.action>,
  "updatedAt" | "createdAt"
>;
export const setActions = async (data: SetActionData[], tx?: Transaction) => {
  const transaction = tx ?? db;
  return await transaction
    .insert(schema.action)
    .values(data)
    .onConflictDoUpdate({
      target: schema.action.id,
      set: {
        assetId: sql`excluded.asset_id`,
        cooldownMinutes: sql`excluded.cooldown_minutes`,
        description: sql`excluded.description`,
        gameId: sql`excluded.game_id`,
        locationId: sql`excluded.location_id`,
        repeatable: sql`excluded.repeatable`,
        name: sql`excluded.name`,
        updatedAt: Temporal.Now.instant(),
      },
    })
    .returning();
};

export const setAction = async (data: SetActionData, tx?: Transaction) => {
  const actions = await setActions([data], tx);
  return actions[0] ?? throwError("Action should exist");
};
