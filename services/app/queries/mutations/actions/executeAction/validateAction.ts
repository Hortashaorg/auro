import { db, eq, schema } from "@package/database";
import type { Action, ModuleFailure } from "./types.ts";
import { ERROR_CODES } from "./types.ts";

export const validateAction = async (
  actionId: string,
): Promise<ModuleFailure | Action> => {
  try {
    const actionData = await db.select()
      .from(schema.action)
      .leftJoin(
        schema.actionResourceCost,
        eq(schema.action.id, schema.actionResourceCost.actionId),
      )
      .leftJoin(
        schema.actionResourceReward,
        eq(schema.action.id, schema.actionResourceReward.actionId),
      )
      .leftJoin(
        schema.actionItemReward,
        eq(schema.action.id, schema.actionItemReward.actionId),
      )
      .where(eq(schema.action.id, actionId));

    if (actionData.length === 0) {
      return {
        error: {
          code: ERROR_CODES.ACTION_NOT_FOUND,
          message: "Action not found",
          context: { actionId },
        },
      };
    }

    const action = actionData[0]?.action;
    if (!action) {
      return {
        error: {
          code: ERROR_CODES.ACTION_NOT_FOUND,
          message: "Action not found",
          context: { actionId },
        },
      };
    }

    const actionResourceCosts = actionData
      .map((data) => data.action_resource_cost)
      .filter((cost) => cost !== null);

    const actionResourceRewards = actionData
      .map((data) => data.action_resource_reward)
      .filter((reward) => reward !== null);

    const actionItemRewards = actionData
      .map((data) => data.action_item_reward)
      .filter((reward) => reward !== null);

    return {
      action,
      actionResourceCosts,
      actionResourceRewards,
      actionItemRewards,
    };
  } catch (error) {
    console.error("Error validating action:", error);
    return {
      error: {
        code: ERROR_CODES.DATABASE_ERROR,
        message: "Failed to validate action",
        context: {
          actionId,
          originalError: error instanceof Error ? error.message : String(error),
        },
      },
    };
  }
};
