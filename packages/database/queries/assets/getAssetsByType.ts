import { db, eq, type InferSelectModel, schema } from "@package/database";

type AssetType = Pick<InferSelectModel<typeof schema.asset>, "type">["type"];
export const getAssetsByType = (type: AssetType) => {
  return db
    .select()
    .from(schema.asset)
    .where(eq(schema.asset.type, type));
};
