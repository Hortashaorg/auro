import { and, db, eq, gt, schema } from "@package/database";
import { currentUser } from "@queries/user/currentUser.ts";

export const getUserResources = async (gameId: string) => {
  const user = await currentUser(gameId);

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
    .orderBy(schema.resource.name)
    .where(
      and(
        eq(schema.user.gameId, gameId),
        gt(schema.userResource.quantity, 0),
        eq(schema.user.id, user.id),
      ),
    );

  return resources;
};
