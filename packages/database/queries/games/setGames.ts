import { type InferInsertModel, sql } from "drizzle-orm";
import { db, schema, type Transaction } from "@db/mod.ts";
import { throwError } from "@package/common";

type SetGameData = Omit<
  InferInsertModel<typeof schema.game>,
  "createdAt" | "updatedAt"
>;

export const setGames = async (data: SetGameData[], tx?: Transaction) => {
  const transaction = tx ?? db;
  return await transaction
    .insert(schema.game)
    .values(data)
    .onConflictDoUpdate({
      target: schema.game.id,
      set: {
        name: sql`excluded.name`,
        actionRecoveryAmount: sql`excluded.action_recovery_amount`,
        actionRecoveryInterval: sql`excluded.action_recovery_interval`,
        maxAvailableActions: sql`excluded.max_available_actions`,
        online: sql`excluded.online`,
        startingAvailableActions: sql`excluded.starting_available_actions`,
        updatedAt: Temporal.Now.instant(),
      },
    })
    .returning();
};

export const setGame = async (data: SetGameData, tx?: Transaction) => {
  const games = await setGames([data], tx);
  return games[0] ?? throwError("Game should exist");
};
