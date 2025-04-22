import { db, schema } from "@package/database";

export const createResourceCost = async (
  props: { actionId: string; resourceId: string; quantity: number },
) => {
  await db.insert(schema.actionResourceCost).values(props);
};
