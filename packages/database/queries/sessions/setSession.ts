import { type InferInsertModel, sql } from "drizzle-orm";
import { db, schema, type Transaction } from "@db/mod.ts";

type SetSessionData = InferInsertModel<typeof schema.session>;

export const setSession = async (
  data: SetSessionData,
  tx?: Transaction,
) => {
  const transaction = tx ?? db;
  return await transaction
    .insert(schema.session)
    .values(data)
    .onConflictDoUpdate({
      target: [schema.session.refreshTokenHash],
      set: {
        accessTokenHash: sql`excluded.access_token_hash`,
      },
    })
    .returning();
};
