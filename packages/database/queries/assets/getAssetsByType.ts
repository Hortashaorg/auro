import { db, type InferSelectModel, schema } from "@db/mod.ts";
import { eq } from "drizzle-orm";

type AssetType = Pick<InferSelectModel<typeof schema.asset>, "type">["type"];
export const getAssetsByType = (type: AssetType) => {
  return db
    .select()
    .from(schema.asset)
    .where(eq(schema.asset.type, type));
};
