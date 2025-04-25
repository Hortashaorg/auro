import { db, eq, schema } from "@package/database";

export const selectLocationAssets = () => {
  return db.select().from(schema.asset).where(
    eq(schema.asset.type, "location"),
  );
};
