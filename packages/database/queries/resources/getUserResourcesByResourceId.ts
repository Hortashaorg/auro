import { db, desc, eq, schema } from "@db/mod.ts";

export const getUserResourcesByResourceId = (resourceId: string) => {
  return db
    .select()
    .from(schema.userResource)
    .innerJoin(
      schema.resource,
      eq(schema.userResource.resourceId, schema.resource.id),
    )
    .innerJoin(schema.user, eq(schema.userResource.userId, schema.user.id))
    .orderBy(desc(schema.userResource.quantity))
    .where(eq(schema.userResource.resourceId, resourceId));
};
