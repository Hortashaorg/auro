import { and, db, desc, eq, schema } from "@package/database";

export type ResourceLeaderboardEntry = {
  user: {
    id: string;
    name: string;
  };
  resource: {
    id: string;
    name: string;
    description: string | null;
  };
  asset: {
    url: string;
  };
  user_resource: {
    quantity: number;
  };
};

export async function getResourceLeaderboard(
  resourceId: string,
): Promise<ResourceLeaderboardEntry[]> {
  const results = await db
    .select({
      user: {
        id: schema.user.id,
        name: schema.user.name,
      },
      resource: {
        id: schema.resource.id,
        name: schema.resource.name,
        description: schema.resource.description,
      },
      asset: {
        url: schema.asset.url,
      },
      user_resource: {
        quantity: schema.userResource.quantity,
      },
    })
    .from(schema.userResource)
    .innerJoin(schema.user, eq(schema.userResource.userId, schema.user.id))
    .innerJoin(
      schema.resource,
      eq(schema.userResource.resourceId, schema.resource.id),
    )
    .innerJoin(schema.asset, eq(schema.resource.assetId, schema.asset.id))
    .where(
      eq(schema.resource.id, resourceId),
    )
    .orderBy(desc(schema.userResource.quantity))
    .limit(100);

  return results.map((result) => ({
    ...result,
    user: {
      ...result.user,
      name: result.user.name || "Unknown User",
    },
  }));
}

export async function getLeaderboardResources(serverId: string) {
  return await db
    .select({
      id: schema.resource.id,
      name: schema.resource.name,
      description: schema.resource.description,
      url: schema.asset.url,
    })
    .from(schema.resource)
    .innerJoin(schema.asset, eq(schema.resource.assetId, schema.asset.id))
    .where(
      and(
        eq(schema.resource.serverId, serverId),
        eq(schema.resource.leaderboard, true),
      ),
    );
}
