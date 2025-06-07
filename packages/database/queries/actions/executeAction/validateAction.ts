import { db, schema } from "@db/mod.ts";
import { eq } from "drizzle-orm";
import type { Action, ModuleFailure } from "./types.ts";
import { ERROR_CODES } from "./types.ts";

export const validateAction = async (
  actionId: string,
): Promise<ModuleFailure | Action> => {
  try {
    const [action] = await db.select()
      .from(schema.action)
      .where(eq(schema.action.id, actionId));

    if (!action) {
      return {
        success: false,
        error: {
          code: ERROR_CODES.ACTION_NOT_FOUND,
          message: "Action not found",
          context: { actionId },
        },
      };
    }

    const actionResourceCosts = await db.select()
      .from(schema.actionResourceCost)
      .where(eq(schema.actionResourceCost.actionId, actionId));

    const actionResourceRewards = await db.select()
      .from(schema.actionResourceReward)
      .where(eq(schema.actionResourceReward.actionId, actionId));

    const actionItemRewards = await db.select()
      .from(schema.actionItemReward)
      .where(eq(schema.actionItemReward.actionId, actionId));

    return {
      success: true,
      action,
      actionResourceCosts,
      actionResourceRewards,
      actionItemRewards,
    } as const;
  } catch (error) {
    console.error("Error validating action:", error);
    return {
      success: false,
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
