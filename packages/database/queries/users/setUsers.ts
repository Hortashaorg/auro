import { type InferInsertModel, sql } from "drizzle-orm";
import { db, schema, type Transaction } from "@db/mod.ts";
import { throwError } from "@package/common";

type SetUserData = Omit<
  InferInsertModel<typeof schema.user>,
  "createdAt" | "updatedAt"
>;
export const setUsers = async (data: SetUserData[], tx?: Transaction) => {
  const transaction = tx ?? db;
  return await transaction
    .insert(schema.user)
    .values(data)
    .onConflictDoUpdate({
      target: [schema.user.id],
      set: {
        accountId: sql`excluded.account_id`,
        type: sql`excluded.type`,
        availableActions: sql`excluded.available_actions`,
        locationId: sql`excluded.location_id`,
        name: sql`excluded.name`,
        gameId: sql`excluded.game_id`,
        updatedAt: Temporal.Now.instant(),
      },
    })
    .returning();
};

export const setUser = async (data: SetUserData, tx?: Transaction) => {
  const users = await setUsers([data], tx);

  return users[0] ?? throwError("User should exist");
};
