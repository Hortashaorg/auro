import {
  db,
  type InferInsertModel,
  schema,
  type Transaction,
} from "@db/mod.ts";
import { eq } from "drizzle-orm";

export type AccountUpdate = Partial<
  Omit<
    InferInsertModel<typeof schema.account>,
    "id" | "createdAt" | "updatedAt"
  >
>;

export const updateAccount = async (
  accountId: string,
  updates: AccountUpdate,
  tx?: Transaction,
) => {
  const transaction = tx ?? db;
  await transaction.update(schema.account)
    .set({
      ...updates,
      updatedAt: Temporal.Now.instant(),
    })
    .where(eq(schema.account.id, accountId));
};
