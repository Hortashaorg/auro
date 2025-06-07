import { db, schema } from "@db/mod.ts";
import { eq } from "drizzle-orm";
import { throwError } from "@package/common";

export const getResourceById = async (resourceId: string) => {
  const result = await db
    .select()
    .from(schema.resource)
    .innerJoin(schema.asset, eq(schema.resource.assetId, schema.asset.id))
    .where(eq(schema.resource.id, resourceId))
    .limit(1);

  return result[0] ?? throwError("Resource not found");
};
