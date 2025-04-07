import { db, eq, schema } from "@package/database";

export const getServerActions = async (serverId: string, userId?: string) => {
  const actions = await db.select({
    id: schema.action.id,
    name: schema.action.name,
    description: schema.action.description,
    cooldownMinutes: schema.action.cooldownMinutes,
    repeatable: schema.action.repeatable,
    assetUrl: schema.asset.url,
    locationName: schema.location.name,
  }).from(schema.action)
    .innerJoin(schema.asset, eq(schema.action.assetId, schema.asset.id))
    .leftJoin(schema.location, eq(schema.action.locationId, schema.location.id))
    .where(
      eq(schema.action.serverId, serverId),
    );

  if (!userId) {
    return actions;
  }

  const costs = await db.select({
    actionId: schema.actionResourceCost.actionId,
    resourceId: schema.actionResourceCost.resourceId,
    quantity: schema.actionResourceCost.quantity,
    resourceName: schema.resource.name,
    resourceAssetUrl: schema.asset.url,
  })
    .from(schema.actionResourceCost)
    .innerJoin(
      schema.resource,
      eq(schema.actionResourceCost.resourceId, schema.resource.id),
    )
    .innerJoin(
      schema.asset,
      eq(schema.resource.assetId, schema.asset.id),
    )
    .innerJoin(
      schema.action,
      eq(schema.actionResourceCost.actionId, schema.action.id),
    )
    .where(
      eq(schema.action.serverId, serverId),
    );

  const userResources = await db.select({
    resourceId: schema.userResource.resourceId,
    quantity: schema.userResource.quantity,
  })
    .from(schema.userResource)
    .where(
      eq(schema.userResource.userId, userId),
    );

  const actionsWithCosts = actions.map((action) => {
    const actionCosts = costs.filter((cost) => cost.actionId === action.id);

    const actionCostsWithUserQuantity = actionCosts.map((cost) => {
      const userResource = userResources.find(
        (resource) => resource.resourceId === cost.resourceId,
      );
      const userQuantity = userResource ? userResource.quantity : 0;

      return {
        ...cost,
        userQuantity,
      };
    });

    const canExecute = actionCostsWithUserQuantity.every((cost) => {
      return cost.userQuantity >= cost.quantity;
    });

    return {
      ...action,
      costs: actionCostsWithUserQuantity,
      canExecute,
    };
  });

  return actionsWithCosts;
};
