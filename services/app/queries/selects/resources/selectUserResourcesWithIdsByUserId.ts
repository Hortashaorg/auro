import { db, eq, schema } from "@package/database";

export const selectUserResourcesWithIdsByUserId = async (userId: string) => {
  return db.select()
    .from(schema.userResource)
    .where(eq(schema.userResource.userId, userId));
};
