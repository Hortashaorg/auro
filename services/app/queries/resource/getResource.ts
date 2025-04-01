import { db, eq, schema } from "@package/database";

export const getResource = async (resourceId: string) => {
  const resource = await db.query.resource.findFirst({
    where: eq(schema.resource.id, resourceId),
  });

  if (!resource) {
    throw new Error("Resource not found");
  }

  return resource;
};
