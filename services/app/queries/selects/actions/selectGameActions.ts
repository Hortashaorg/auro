import { db, eq, schema } from "@package/database";
import { throwError } from "@package/common";
/**
 * Selects basic game action details joined with assets and locations.
 * Used primarily for admin views or listings where user context isn't needed.
 * @param gameId The ID of the game.
 */
export const selectBaseGameActions = async (gameId: string) => {
  const actions = await db.select().from(schema.action)
    .innerJoin(schema.asset, eq(schema.action.assetId, schema.asset.id))
    .leftJoin(schema.location, eq(schema.action.locationId, schema.location.id))
    .where(
      eq(schema.action.gameId, gameId),
    );
  return actions;
};

/**
 * Selects game actions, including resource costs and execution status for a specific user.
 * @param gameId The ID of the game.
 * @param userId The ID of the user whose context (resources) should be used.
 */
export const selectUserGameActions = async (gameId: string, userId: string) => {
  const actions = await selectBaseGameActions(gameId);

  const costs = await db.select()
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
      eq(schema.action.gameId, gameId),
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
    const actionCosts = costs.filter((cost) =>
      cost.action.id === action.action.id
    );

    const actionCostsWithUserQuantity = actionCosts.map((cost) => {
      const userResource = userResources.find(
        (resource) => resource.resourceId === cost.resource.id,
      );
      const userQuantity = userResource ? userResource.quantity : 0;

      return {
        ...cost,
        userQuantity,
      };
    });

    const canExecute = actionCostsWithUserQuantity.every((cost) => {
      return cost.userQuantity >= cost.action_resource_cost.quantity;
    });

    return {
      ...action,
      costs: actionCostsWithUserQuantity.map((cost) => ({
        userQuantity: cost.userQuantity,
        resource: cost.resource,
        resourceAsset: cost.asset,
        cost: cost.action_resource_cost.quantity,
      })),
      canExecute,
    };
  });

  return actionsWithCosts;
};

/**
 * Selects a single action by its ID, returning id and name.
 * @param actionId The ID of the action.
 */
export const selectActionById = async (actionId: string) => {
  const actions = await db.select({
    id: schema.action.id,
    name: schema.action.name,
  })
    .from(schema.action)
    .where(eq(schema.action.id, actionId));
  return actions[0] ?? throwError("Action not found");
};
