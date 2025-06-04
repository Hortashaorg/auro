import { db, eq, schema } from "@db/mod.ts";

export const getUserResourcesById = (userId: string) => {
  return db
    .select()
    .from(schema.userResource)
    .where(
      eq(schema.userResource.userId, userId),
    );
};
