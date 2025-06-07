import {
  db,
  type InferInsertModel,
  schema,
  type Transaction,
} from "@db/mod.ts";
import { eq } from "drizzle-orm";

export type UserUpdate = Partial<
  Omit<
    InferInsertModel<typeof schema.user>,
    "id" | "createdAt" | "updatedAt"
  >
>;

export const updateUser = async (
  userId: string,
  updates: UserUpdate,
  tx?: Transaction,
) => {
  const transaction = tx ?? db;
  await transaction.update(schema.user)
    .set({
      ...updates,
      updatedAt: Temporal.Now.instant(),
    })
    .where(eq(schema.user.id, userId));
};
