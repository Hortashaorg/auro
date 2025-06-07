import { eq } from "drizzle-orm";
import { db, schema, type Transaction } from "@db/mod.ts";
import { throwError } from "@package/common";

export const getAssetByName = async (name: string, tx?: Transaction) => {
  const transaction = tx ?? db;
  const asset = await transaction.query.asset.findFirst({
    where: eq(schema.asset.name, name),
  });

  return asset ?? throwError("Asset not found");
};
