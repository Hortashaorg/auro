import { db, eq, schema } from "@package/database";

export const getResourcesByUserId = async (userId: string) => {
  return await db.select()
    .from(schema.userResource)
    .innerJoin(
      schema.resource,
      eq(schema.userResource.resourceId, schema.resource.id),
    )
    .innerJoin(schema.asset, eq(schema.resource.assetId, schema.asset.id))
    .where(eq(schema.userResource.userId, userId));
};
