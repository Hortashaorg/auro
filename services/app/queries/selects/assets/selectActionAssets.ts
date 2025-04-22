import { db, eq, schema } from "@package/database";

export const selectActionAssets = () => {
  return db.select().from(schema.asset).where(eq(schema.asset.type, "action"));
};
