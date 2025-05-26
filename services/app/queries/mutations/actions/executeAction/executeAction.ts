import { validateUser } from "./validateUser.ts";
import { validateAction } from "./validateAction.ts";
import { validateExecution } from "./validateExecution.ts";
import { executeTransaction } from "./executeTransaction.ts";

export const executeAction = async (
  actionId: string,
  userId: string,
) => {
  const userResult = await validateUser(userId);
  if ("error" in userResult) {
    return { success: false, error: userResult.error.message };
  }

  const actionResult = await validateAction(actionId);
  if ("error" in actionResult) {
    return { success: false, error: actionResult.error.message };
  }

  const executionResult = validateExecution(userResult, actionResult);
  if ("error" in executionResult) {
    return { success: false, error: executionResult.error.message };
  }

  const transactionResult = await executeTransaction(userResult, actionResult);
  if ("error" in transactionResult) {
    return { success: false, error: transactionResult.error.message };
  }

  return transactionResult;
};
