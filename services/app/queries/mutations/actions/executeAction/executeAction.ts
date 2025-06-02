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
  if ("error" in actionResult) {
    return actionResult;
  }

  const userResult = await validateUser(userId);
  if ("error" in userResult) {
    return userResult;
  }

  const executionResult = validateExecution(userResult, actionResult);
  if ("error" in executionResult) {
    return executionResult;
  }

  const transactionResult = await executeTransaction(userResult, actionResult);
  if (transactionResult.success) {
    return transactionResult;
  }

  return transactionResult;
};
