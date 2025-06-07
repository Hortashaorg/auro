import { db, schema } from "@db/mod.ts";
import { eq } from "drizzle-orm";
import { throwError } from "@package/common";

export const getActionById = async (actionId: string) => {
  const actions = await db
    .select()
    .from(schema.action)
    .where(
      eq(schema.action.id, actionId),
    );

  return actions[0] ?? throwError("Action not found");
};
