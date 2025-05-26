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
    return userResult;
  }

  const actionResult = await validateAction(actionId);
  if ("error" in actionResult) {
    return actionResult;
  }

  const executionResult = validateExecution(userResult, actionResult);
  if ("error" in executionResult) {
    return executionResult;
  }

  const transactionResult = await executeTransaction(userResult, actionResult);
  if ("error" in transactionResult) {
    return transactionResult;
  }

  return transactionResult;
};
