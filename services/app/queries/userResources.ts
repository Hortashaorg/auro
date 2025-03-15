import { and, db, eq, gt, schema } from "@package/database";

export const getUserResources = async (serverId: string) => {
  const resources = await db.select()
    .from(schema.userResource)
    .innerJoin(
      schema.resource,
      eq(schema.userResource.resourceId, schema.resource.id),
    )
    .innerJoin(
      schema.asset,
      eq(schema.resource.assetId, schema.asset.id),
    )
    .innerJoin(
      schema.user,
      eq(schema.userResource.userId, schema.user.id),
    )
    .where(
      and(
        eq(schema.user.serverId, serverId),
        gt(schema.userResource.quantity, 0),
      ),
    );

  return resources;
};
