import { validateUser } from "./validateUser.ts";

export const executeAction = async (
  actionId: string,
  userId: string,
) => {
  const userResult = await validateUser(userId);
  if ("error" in userResult) {
    return userResult;
  }

  const user = userResult;
  console.log(user, "is typesafe user about to do action", actionId);

  return "result";
};
