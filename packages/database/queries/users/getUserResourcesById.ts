import { db, schema } from "@db/mod.ts";
import { eq } from "drizzle-orm";

export const getUserResourcesById = (userId: string) => {
  return db
    .select()
    .from(schema.userResource)
    .where(
      eq(schema.userResource.userId, userId),
    );
};
