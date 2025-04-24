import { db, eq, type InferInsertModel, schema } from "@package/database";

export type UserUpdate = Partial<
  Omit<InferInsertModel<typeof schema.user>, "id" | "createdAt" | "updatedAt">
>;

export const updateUser = async (
  userId: string,
  updates: UserUpdate,
) => {
  await db.update(schema.user)
    .set(updates)
    .where(eq(schema.user.id, userId));
};
