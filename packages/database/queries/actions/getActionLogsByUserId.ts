import { db, schema } from "@db/mod.ts";
import { desc, eq } from "drizzle-orm";

export const getActionLogsByUserId = async (
  userId: string,
) => {
  return await db
    .select()
    .from(schema.actionLog)
    .innerJoin(schema.action, eq(schema.actionLog.actionId, schema.action.id))
    .innerJoin(schema.asset, eq(schema.action.assetId, schema.asset.id))
    .innerJoin(
      schema.location,
      eq(schema.action.locationId, schema.location.id),
    )
    .where(
      eq(schema.actionLog.userId, userId),
    )
    .orderBy(desc(schema.actionLog.executedAt));
};
