import { db, eq, schema } from "@package/database";

export const selectResourceAssets = () => {
  return db.select().from(schema.asset).where(
    eq(schema.asset.type, "resource"),
  );
};
