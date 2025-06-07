import type { InferInsertModel } from "drizzle-orm";
import { db, schema, type Transaction } from "@db/mod.ts";

type ActionLogData = Omit<
  InferInsertModel<typeof schema.actionLog>,
  "version" | "id"
>;
export const insertActionLog = async (
  data: ActionLogData,
  tx?: Transaction,
) => {
  const transaction = tx ?? db;
  return await transaction
    .insert(schema.actionLog)
    .values({
      ...data,
      version: 1,
    })
    .returning();
};
