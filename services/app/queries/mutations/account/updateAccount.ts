import { db, eq, type InferInsertModel, schema } from "@package/database";

export type AccountUpdate = Partial<
  Omit<
    InferInsertModel<typeof schema.account>,
    "id" | "createdAt" | "updatedAt"
  >
>;

export const updateAccount = async (
  accountId: string,
  updates: AccountUpdate,
) => {
  await db.update(schema.account)
    .set(updates)
    .where(eq(schema.account.id, accountId));
};
