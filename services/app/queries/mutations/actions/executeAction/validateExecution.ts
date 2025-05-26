import type { Action, ModuleFailure, User } from "./types.ts";
import { ERROR_CODES } from "./types.ts";

export const validateExecution = (
  user: User,
  action: Action,
): ModuleFailure | { canExecute: true } => {
  // Check if user has sufficient resources for all action costs
  for (const cost of action.actionResourceCosts) {
    const userResource = user.userResources.find(
      (ur) => ur.resourceId === cost.resourceId,
    );

    const userQuantity = userResource?.quantity ?? 0;

    if (userQuantity < cost.quantity) {
      return {
        error: {
          code: ERROR_CODES.INSUFFICIENT_RESOURCES,
          message: "Insufficient resources to execute action",
          context: {
            actionId: action.action.id,
            userId: user.user.id,
            resourceId: cost.resourceId,
            required: cost.quantity,
            available: userQuantity,
          },
        },
      };
    }
  }

  return { canExecute: true };
};
