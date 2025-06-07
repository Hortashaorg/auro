import { type InferInsertModel, sql } from "drizzle-orm";
import { db, schema, type Transaction } from "@db/mod.ts";
import { throwError } from "@package/common";

type SetUserResourceData = Omit<
  InferInsertModel<typeof schema.userResource>,
  "createdAt" | "updatedAt"
>;
export const setUserResources = async (
  data: SetUserResourceData[],
  tx?: Transaction,
) => {
  const transaction = tx ?? db;
  return await transaction
    .insert(schema.userResource)
    .values(data)
    .onConflictDoUpdate({
      target: [schema.userResource.userId, schema.userResource.resourceId],
      set: {
        quantity: sql`excluded.quantity`,
        updatedAt: Temporal.Now.instant(),
      },
    });
};

export const setUserResource = async (
  data: SetUserResourceData,
  tx?: Transaction,
) => {
  const userResources = await setUserResources([data], tx);
  return userResources[0] ?? throwError("User Resource should exist");
};
