import { db, eq, schema } from "@package/database";

export const selectItemAssets = () => {
  return db.select().from(schema.asset).where(eq(schema.asset.type, "item"));
};
