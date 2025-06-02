import { validateUser } from "./validateUser.ts";
import { validateAction } from "./validateAction.ts";
import { validateExecution } from "./validateExecution.ts";
import { executeTransaction } from "./executeTransaction.ts";
import type { ModuleFailure } from "./types.ts";

export const executeAction = async (
  actionId: string,
  userId: string,
): Promise<
  {
    success: true;
    result: Record<string, unknown>;
  } | ModuleFailure
> => {
  const actionResult = await validateAction(actionId);
  if (!actionResult.success) {
    return actionResult;
  }

  const userResult = await validateUser(userId);
  if (!userResult.success) {
    return userResult;
  }

  const executionResult = validateExecution(userResult, actionResult);
  if (!executionResult.success) {
    return executionResult;
  }

  const transactionResult = await executeTransaction(userResult, actionResult);
  if (!transactionResult.success) {
    return transactionResult;
  }

  return transactionResult;
};
