import { validateUser } from "./validateUser.ts";
import { validateAction } from "./validateAction.ts";
import { validateExecution } from "./validateExecution.ts";

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

  const user = userResult;
  const action = actionResult;
  console.log(user, "is typesafe user about to do action", action);

  return "result";
};
