import { db, eq, type InferInsertModel, schema } from "@package/database";

export type UserUpdate = Partial<
  Omit<InferInsertModel<typeof schema.user>, "id" | "createdAt" | "updatedAt">
>;

export const updateUser = async (
  userId: string,
  updates: UserUpdate,
): Promise<void> => {
  await db.update(schema.user)
    .set({
      ...updates,
      updatedAt: Temporal.Now.instant(),
    })
    .where(eq(schema.user.id, userId));
};
