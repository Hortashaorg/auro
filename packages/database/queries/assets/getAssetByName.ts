import { eq } from "drizzle-orm";
import { db, schema } from "@db/mod.ts";
import { throwError } from "@package/common";

export const getAssetByName = async (name: string) => {
  const asset = await db.query.asset.findFirst({
    where: eq(schema.asset.name, name),
  });

  return asset ?? throwError("Asset not found");
};
