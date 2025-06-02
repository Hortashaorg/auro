import { db, type InferInsertModel, schema } from "@package/database";
import { throwError } from "@package/common";

type CreateResourceData = InferInsertModel<typeof schema.resource>;
export const createResources = async (data: CreateResourceData[]) => {
  const resources = await db.insert(schema.resource)
    .values(data).returning();

  return resources;
};

export const createResource = async (data: CreateResourceData) => {
  const resources = await createResources([data]);

  return resources[0] ?? throwError("Resource should exist");
};
