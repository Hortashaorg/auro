import { db } from "@package/database";
import type { Action, User } from "./types.ts";
import { ERROR_CODES } from "./types.ts";
import {
  applyActionLog,
  applyItemRewards,
  applyResourceChanges,
  applyUserActionCost,
} from "./apply/index.ts";

export const executeTransaction = async (
  user: User,
  action: Action,
) => {
  try {
    const result = await db.transaction(async (tx) => {
      // Apply all changes in sequence and collect results
      const userResult = await applyUserActionCost(tx, user);
      const resourceResult = await applyResourceChanges(tx, user, action);
      const itemsResult = await applyItemRewards(tx, user, action);
      await applyActionLog(tx, user, action, resourceResult.resourceChanges);

      const result = {
        ...userResult,
        ...resourceResult,
        ...itemsResult,
      };

      return {
        success: true,
        result,
      } as const;
    });

    return result;
  } catch (error) {
    console.error("Error executing action transaction:", error);
    return {
      success: false,
      error: {
        code: ERROR_CODES.DATABASE_ERROR,
        message: "Failed to execute action",
        context: {
          actionId: action.action.id,
          userId: user.user.id,
          originalError: error instanceof Error ? error.message : String(error),
        },
      },
    } as const;
  }
};
