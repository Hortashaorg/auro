import { db } from "@package/database";
import type { Action, ModuleFailure, User } from "./types.ts";
import { ERROR_CODES } from "./types.ts";
import {
  applyActionCost,
  applyItemRewards,
  applyResourceRewards,
} from "./apply/index.ts";

export const executeTransaction = async (
  user: User,
  action: Action,
): Promise<ModuleFailure | { success: true }> => {
  try {
    await db.transaction(async (tx) => {
      // Apply all changes in sequence
      await applyActionCost(tx, user, action);
      await applyResourceRewards(tx, user, action);
      await applyItemRewards(tx, user, action);
    });

    return { success: true };
  } catch (error) {
    console.error("Error executing action transaction:", error);
    return {
      error: {
        code: ERROR_CODES.DATABASE_ERROR,
        message: "Failed to execute action",
        context: {
          actionId: action.action.id,
          userId: user.user.id,
          originalError: error instanceof Error ? error.message : String(error),
        },
      },
    };
  }
};
