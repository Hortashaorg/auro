import { db, eq, schema } from "@package/database";
import { throwError } from "@package/common";

export const getAction = async (actionId: string) => {
  const action = await db.query.action.findFirst({
    where: eq(schema.action.id, actionId),
  });

  if (!action) throwError(`Action not found: ${actionId}`);

  return action;
};
