import { db, eq, schema } from "@package/database";

export const selectUserResourcesByUserId = (userId: string) => {
  return db.select()
    .from(schema.userResource)
    .where(eq(schema.userResource.userId, userId));
};
